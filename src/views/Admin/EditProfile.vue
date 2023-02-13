<template>
    <div class="container">
        <div class="page-header">
            <h1>Edit Profile</h1>
        </div>

        <div class="row">
            <div class="col">
                <div
                    class="text-center"
                    style="margin-bottom: 10px"
                >
                    <img
                        v-if="profile_pic == null"
                        class="profile-image"
                        :src="require('../../assets/images/profile_image.png')"
                        height="200"
                    />
                    <img
                        v-if="
                            profile_pic != null && profile_pic == this.picture
                        "
                        class="profile-image"
                        :src="'http://127.0.0.1:8000/img/' + profile_pic"
                        height="200"
                    />
                    <img
                        v-if="profile_pic != this.picture"
                        class="profile-image"
                        :src="profile_pic"
                        height="200"
                    />
                    <div class="form-group">
                        <input
                            v-on:change="onProfilePicChange($event)"
                            type="file"
                            id="imageFile"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="row mt-3">
                    <div class="form-group">
                        <label for="full-name" class="control-label">
                            Full Name:
                        </label>
                        <input
                            v-model="fullname"
                            type="text"
                            class="form-control"
                            id="full-name"
                            placeholder="Enter Full Name"
                        />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="form-group">
                        <label for="full-name" class="control-label">
                            Username:
                        </label>
                        <input
                            v-model="username"
                            type="text"
                            class="form-control"
                            id="full-name"
                            placeholder="Enter Username"
                        />
                    </div>
                </div>
                <div class="row mt-3" v-if="!showPasswords">
                    <h6
                        @click="showPassword()"
                        style="cursor: pointer; text-decoration: underline"
                    >
                        Change Password
                    </h6>
                </div>
                <div class="row mt-3" v-if="showPasswords">
                    <div class="form-group">
                        <label for="full-name" class="control-label">
                            Old Password:
                        </label>
                        <input
                            v-model="old_password"
                            type="password"
                            class="form-control"
                            id="full-name"
                            placeholder="Enter Password"
                        />
                    </div>
                </div>
                <div class="row mt-3" v-if="showPasswords">
                    <div class="form-group">
                        <label for="full-name" class="control-label">
                            Password:
                        </label>
                        <input
                            v-model="password"
                            type="password"
                            class="form-control"
                            id="full-name"
                            placeholder="Enter Password"
                        />
                    </div>
                </div>
                <div class="row mt-3" v-if="showPasswords">
                    <div class="form-group">
                        <label for="full-name" class="control-label">
                            Re-enter Password:
                        </label>
                        <input
                            v-model="confirm_password"
                            type="password"
                            class="form-control"
                            id="full-name"
                            placeholder="Re-enter Password"
                        />
                    </div>
                </div>
                <button
                    class="btn btn-success mt-3"
                    @click="updateProfile()"
                    v-if="!loading"
                >
                    Update
                </button>
                <button v-if="loading" class="btn btn-success mt-3" disabled>
                    <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    ></span>
                </button>
                <button
                    v-if="showPasswords"
                    class="btn btn-primary"
                    @click="cancelPassword()"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            id: null,
            fullname: "",
            username: "",
            old_password: "",
            password: "",
            confirm_password: "",
            profile_pic: null,

            officials: [],
            errors: [],
            picture: null,

            search: localStorage.getItem("token"),

            permission: localStorage.getItem("permission"),
            loading: false,
            showPasswords: false,
        };
    },

    methods: {
        showPassword() {
            this.showPasswords = true;
        },

        cancelPassword() {
            this.showPasswords = false;
        },

        onProfilePicChange(e) {
            if (e.target?.files[0]) {
                this.profile_pic = null;
                this.profile_pic = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.profile_pic);
                reader.onload = (e) => {
                    this.profile_pic = e.target.result;
                };
            }
        },

        async fetchOfficial() {
            this.loading = true;
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios
                .post(`/find-officials`, data)
                .then((response) => {
                    this.officials = response.data;
                    this.fullname = this.officials.officials.fullname;
                    this.username = this.officials.users.name;
                    this.profile_pic = this.officials.officials.profile_pic;
                    this.picture = this.officials.officials.profile_pic;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async updateProfile() {
            this.loading = true;
            if (
                this.showPasswords == false &&
                (this.fullname == "" || this.username == "")
            ) {
                this.$toast.error("Please fill out all fields!");
                console.log(this.fullname);
                this.loading = false;
            } else if (
                this.showPasswords == true &&
                (this.old_password == "" ||
                    this.password == "" ||
                    this.confirm_password == "")
            ) {
                this.$toast.error("Please fill out all fields!");
                this.loading = false;
                console.log(this.showPasswords);
            } else if (
                this.showPasswords == true &&
                this.password != this.confirm_password
            ) {
                this.$toast.error("Please make sure your password match!");
                this.loading = false;
            } else if (this.showPasswords == false) {
                const data = {
                    fullname: this.fullname,
                    username: this.username,
                    profile_pic: this.profile_pic,
                    token: localStorage.getItem("token"),
                };
                await axios
                    .post(`/update-profile`, data)
                    .then((response) => {
                        this.officials = response.data;
                        this.fullname = this.officials.officials.fullname;
                        this.username = this.officials.users.name;
                        this.profile_pic = this.officials.officials.profile_pic;
                        this.picture = this.officials.officials.profile_pic;
                        this.$toast.success(
                            "Successfully update your profile!"
                        );
                        this.showPasswords = false;
                    })
                    .catch((error) => {
                        this.$toast.error(error.response.data);
                    });
                this.loading = false;
            } else if (
                (this.showPasswords == true && this.old_password != "") ||
                this.password != "" ||
                this.confirm_password != ""
            ) {
                const data = {
                    fullname: this.fullname,
                    username: this.username,
                    old_password: this.old_password,
                    password: this.password,
                    profile_pic: this.profile_pic,
                    token: localStorage.getItem("token"),
                };
                await axios
                    .post(`/update-profile`, data)
                    .then((response) => {
                        this.officials = response.data;
                        this.fullname = this.officials.officials.fullname;
                        this.username = this.officials.users.name;
                        this.profile_pic = this.officials.officials.profile_pic;
                        this.picture = this.officials.officials.profile_pic;
                        this.$toast.success(
                            "Successfully update your profile!"
                        );
                        this.showPasswords = false;
                    })
                    .catch((error) => {
                        this.$toast.error(error.response.data);
                    });
                this.loading = false;
            }
        },
    },

    mounted() {
        this.fetchOfficial();
    },
};
</script>