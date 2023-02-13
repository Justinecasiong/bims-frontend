<template>
    <div class="container">
        <div class="page-header">
            <h1>Edit Profile</h1>
        </div>

        <div class="row">
            <div class="col">
                <div class="text-center" style="margin-bottom: 10px">
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
        <div class="row mt-5">
            <div
                class="card card-round text-white bg-primary text-center"
                v-b-modal.modal-edit
                style="cursor: pointer; width: 50%; margin: 0 auto; float: none"
            >
                <card-body>
                    <h5>Edit Profile</h5>
                </card-body>
            </div>
        </div>
        <b-modal
            class="edit_modal"
            id="modal-edit"
            title="Edit Resident Details"
            size="xl"
            @ok.prevent="updateResident()"
            centered
            ok-title="Update"
            cancel-title="Close"
        >
            <div class="row">
                <!-- <div class="col-lg-4">
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="national-id" class="control-label">
                                    National ID:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="national-id"
                                    placeholder="Enter National ID"
                                    v-model="national_id"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="citizenship" class="control-label">
                                    Citizenship:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="national-id"
                                    placeholder="Enter Citizenship"
                                    v-model="citizenship"
                                />
                            </div>
                        </div>
                    </div>
                </div> -->

                <div class="col">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    First Name:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="first-name"
                                    placeholder="Enter First Name"
                                    v-model="first_name"
                                />
                                <div v-if="this.errors.first_name">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.first_name[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="middle-name" class="control-label">
                                    Middle Name:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="middle-name"
                                    placeholder="Enter Middle Name"
                                    v-model="middle_name"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="last-name" class="control-label">
                                    Last Name:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="last-name"
                                    placeholder="Enter Last Name"
                                    v-model="last_name"
                                />
                                <div v-if="this.errors.last_name">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.last_name[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="alias" class="control-label">
                                    Alias:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="alias"
                                    placeholder="Enter Alias"
                                    v-model="alias"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="birthplace" class="control-label">
                                    Place of Birth:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="birthplace"
                                    placeholder="Enter Birthplace"
                                    v-model="place_of_birth"
                                />
                                <div v-if="this.errors.place_of_birth">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.place_of_birth[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="birthdate" class="control-label">
                                    Birthdate:
                                </label>
                                <input
                                    type="date"
                                    class="form-control"
                                    id="birthdate"
                                    placeholder="Enter Birthdate"
                                    v-model="birthdate"
                                />
                                <div v-if="this.errors.birthdate">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.birthdate[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="age" class="control-label">
                                    Age:
                                </label>
                                <input
                                    type="number"
                                    class="form-control"
                                    id="age"
                                    placeholder="Enter Age"
                                    v-model="age"
                                />
                                <div v-if="this.errors.age">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.age[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="civil-status" class="control-label">
                                    Civil Status:
                                </label>
                                <select
                                    class="form-select"
                                    name="civil-status"
                                    id="civil_status"
                                    v-model="civil_status"
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                <div v-if="this.errors.civil_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.civil_status[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Sex:
                                </label>
                                <select
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="sex"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div v-if="this.errors.sex">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.sex[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Zone:
                                </label>
                                <select
                                    class="form-select"
                                    name="zone"
                                    id="zone"
                                    v-model="zone_id"
                                >
                                    <option
                                        v-for="zone in zones"
                                        :key="zone.id"
                                        :value="zone.id"
                                    >
                                        {{ zone.zone_description }}
                                    </option>
                                </select>
                                <div v-if="this.errors.zone_id">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.zone_id[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Voter's Status:
                                </label>
                                <select
                                    class="form-select"
                                    name="voter-status"
                                    id="voter_status"
                                    v-model="voter_status"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <div v-if="this.errors.voter_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.voter_status[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Identified as:
                                </label>
                                <select
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="identified_as"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <div v-if="this.errors.identified_as">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.identified_as[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="email-add" class="control-label">
                                    Email Address:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="email-add"
                                    placeholder="Enter Email Address"
                                    v-model="email"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label
                                    for="contact-number"
                                    class="control-label"
                                >
                                    Contact Number:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="contact-number"
                                    placeholder="Enter Contact Number"
                                    v-model="contact_num"
                                />
                                <div v-if="this.errors.contact_num">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.contact_num[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="occupation" class="control-label">
                                    Occupation:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="occupation"
                                    placeholder="Enter Occupation"
                                    v-model="occupation"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="pwd-status" class="control-label">
                                    PWD Status:
                                </label>
                                <select
                                    class="form-select"
                                    name="pwd-status"
                                    id="pwd_status"
                                    v-model="pwd_status"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <div v-if="this.errors.pwd_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.pwd_status[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="address" class="control-label">
                                    Address:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="address"
                                    placeholder="Enter Address"
                                    v-model="address"
                                />
                                <div v-if="this.errors.address">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.address[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>
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

            zone_id: null,
            first_name: null,
            middle_name: null,
            last_name: null,
            alias: null,
            place_of_birth: null,
            birthdate: null,
            age: null,
            civil_status: null,
            sex: null,
            voter_status: null,
            identified_as: null,
            email: null,
            contact_num: null,
            occupation: null,
            pwd_status: null,
            address: null,
            national_id: null,
            citizenship: null,

            officials: [],
            errors: [],
            picture: null,

            search: localStorage.getItem("token"),

            permission: localStorage.getItem("permission"),
            loading: false,
            showPasswords: false,
        };
    },

    computed: {
        zones() {
            return this.$store.getters["ZONES/GET_ZONES"];
        },
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

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
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
                    this.setResidents(response.data.resident);
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        setResidents(data) {
            this.id = data.id;
            this.zone_id = data.zone_id;
            this.first_name = data.first_name;
            this.middle_name = data.middle_name;
            this.last_name = data.last_name;
            this.alias = data.alias;
            this.place_of_birth = data.place_of_birth;
            this.birthdate = data.birthdate;
            this.age = data.age;
            this.civil_status = data.civil_status;
            this.sex = data.sex;
            this.voter_status = data.voter_status;
            this.identified_as = data.identified_as;
            this.email = data.email;
            this.contact_num = data.contact_num;
            this.occupation = data.occupation;
            this.pwd_status = data.pwd_status;
            this.address = data.address;
            this.national_id = data.national_id;
            this.citizenship = data.citizenship;
        },

        async updateResident() {
            const data = {
                id: this.id,
                zone_id: this.zone_id,
                first_name: this.first_name,
                middle_name: this.middle_name,
                last_name: this.last_name,
                alias: this.alias,
                place_of_birth: this.place_of_birth,
                birthdate: this.birthdate,
                age: this.age,
                civil_status: this.civil_status,
                sex: this.sex,
                voter_status: this.voter_status,
                identified_as: this.identified_as,
                email: this.email,
                contact_num: this.contact_num,
                occupation: this.occupation,
                pwd_status: this.pwd_status,
                address: this.address,
                national_id: this.national_id,
                citizenship: this.citizenship,
            };

            await axios
                .put(`/resident/${data.id}`, data)
                .then(() => {
                    this.$toast.success("Resident data has been updated.");
                    this.findResident();

                    this.$bvModal.hide("modal-edit");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
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
                    .post(`/update-resident-profile`, data)
                    .then((response) => {
                        this.residents = response.data;
                        this.username = this.residents.users.name;
                        this.profile_pic = this.residents.resident.profile_pic;
                        this.picture = this.residents.resident.profile_pic;
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
                    .post(`/update-resident-profile`, data)
                    .then((response) => {
                        this.residents = response.data;
                        this.username = this.residents.users.name;
                        this.profile_pic = this.residents.resident.profile_pic;
                        this.picture = this.residents.resident.profile_pic;
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
        this.fetchZones();
    },
};
</script>