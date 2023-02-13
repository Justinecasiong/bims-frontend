<template>
    <div class="container">
        <div class="page-header">
            <h1>Edit Profile</h1>
        </div>

        <div class="row" style="width: 50%">
            <div class="col">
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

        async findResident() {
            this.loading = true;
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios
                .post(`/find-resident`, data)
                .then((response) => {
                    this.residents = response.data;
                    this.username = this.residents.users.name;
                    this.profile_pic = this.residents.resident.profile_pic;
                    this.picture = this.residents.resident.profile_pic;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async updateProfile() {
            this.loading = true;
            if (this.showPasswords == false && this.username == "") {
                this.$toast.error("Please fill out all fields!");
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
                    username: this.username,
                    profile_pic: this.profile_pic,
                    token: localStorage.getItem("token"),
                };
                await axios
                    .post(`/update-admin-profile`, data)
                    .then((response) => {
                        this.residents = response.data;
                        this.username = this.residents.users.name;
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
                    username: this.username,
                    old_password: this.old_password,
                    password: this.password,
                    profile_pic: this.profile_pic,
                    token: localStorage.getItem("token"),
                };
                await axios
                    .post(`/update-admin-profile`, data)
                    .then((response) => {
                        this.residents = response.data;
                        this.username = this.residents.users.name;
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
        this.findResident();
    },
};
</script>