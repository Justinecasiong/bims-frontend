<template>
    <div class="login">
        <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>

        <div class="container register">
            <div class="card">
                <h5>Resident Registration - User Profile</h5>

                <div class="container">
                    <form @submit.prevent="nextPage">
                        <div class="mt-3 loading-bar1">
                            <h6 class="text-center" style="color: white">
                                50%
                            </h6>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="first-name"
                                        class="control-label"
                                    >
                                        Zone:
                                    </label>
                                    <select
                                        class="form-select"
                                        name="zone"
                                        id="zone"
                                        v-model="zone_id"
                                        required
                                    >
                                        <option
                                            v-for="zone in zones"
                                            :key="zone.id"
                                            :value="zone.id"
                                        >
                                            {{ zone.zone_description }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="first-name"
                                        class="control-label"
                                    >
                                        Voter's Status:
                                    </label>
                                    <select
                                        class="form-select"
                                        name="voter-status"
                                        id="voter_status"
                                        v-model="voter_status"
                                        required
                                    >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="first-name"
                                        class="control-label"
                                    >
                                        Identified as:
                                    </label>
                                    <select
                                        class="form-select"
                                        name="sex"
                                        id="sex"
                                        v-model="identified_as"
                                        required
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="email-add"
                                        class="control-label"
                                    >
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
                                        required
                                    />
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="occupation"
                                        class="control-label"
                                    >
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
                        <div class="form-group">
                            <label for="pwd-status" class="control-label">
                                PWD Status:
                            </label>
                            <select
                                class="form-select"
                                name="pwd-status"
                                id="pwd_status"
                                v-model="pwd_status"
                                required
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            <div v-if="this.errors.pwd_status">
                                <label style="color: red; font-weight: 500">{{
                                    this.errors.pwd_status[0]
                                }}</label>
                            </div>
                        </div>
                        <div>
                            <button
                                class="btn btn-primary mt-4"
                                style="width: 100; float: right"
                                type="submit"
                            >
                                Next
                            </button>
                            <button
                                class="btn btn-secondary mt-4"
                                style="width: 100; float: right"
                                @click="backPage()"
                            >
                                Back
                            </button>
                            <button
                                class="btn btn-warning mt-4"
                                style="width: 100; float: right"
                                @click="resetFields()"
                            >
                                Clear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: "",
            zone_id: 1,
            first_name: "",
            middle_name: "",
            last_name: "",
            alias: "",
            place_of_birth: "",
            birthdate: "",
            age: "",
            civil_status: "",
            sex: "",
            voter_status: "",
            identified_as: "",
            email: "",
            contact_num: "",
            occupation: "",
            pwd_status: "",
            address: "Sto. Niño Extension., Barangay 6-A, Tacloban City",
            profile_pic: "",
            national_id: "",
            citizenship: "",

            picture: "",

            residents: [],
            errors: [],

            search: "",
            search_zone: "",

            loading: false,
            currentPalias: 1,
            rows: 0,
            perPage: 0,
        };
    },

    computed: {
        zones() {
            return this.$store.getters["ZONES/GET_ZONES"];
        },
    },

    methods: {
        nextPage() {
            if (
                this.zone_id == "" ||
                this.voter_status == "" ||
                this.identified_as == "" ||
                this.pwd_status == "" ||
                this.address == "" ||
                this.contact_num == ""
            ) {
                this.$toast.error("Invalid input!");
            } else {
                const data = {
                    zone_id: this.zone_id,
                    voter_status: this.voter_status,
                    identified_as: this.identified_as,
                    email: this.email,
                    contact_num: this.contact_num,
                    occupation: this.occupation,
                    pwd_status: this.pwd_status,
                    address: this.address,
                };
                localStorage.setItem("user2", JSON.stringify(data));
                this.$router.push("/register/user-profile-information");
            }
        },

        backPage() {
            this.$router.push("/register/user-information");
        },

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

        setFields() {
            const data = JSON.parse(localStorage.getItem("user2"));
            this.zone_id = data.zone_id;
            this.voter_status = data.voter_status;
            this.identified_as = data.identified_as;
            this.email = data.email;
            this.contact_num = data.contact_num;
            this.occupation = data.occupation;
            this.pwd_status = data.pwd_status;
            this.address = data.address;
        },

        resetFields() {
            this.id = "";
            this.zone_id = "";
            this.first_name = "";
            this.middle_name = "";
            this.last_name = "";
            this.alias = "";
            this.place_of_birth = "";
            this.birthdate = "";
            this.age = "";
            this.civil_status = "";
            this.sex = "";
            this.voter_status = "";
            this.identified_as = "";
            this.email = "";
            this.contact_num = "";
            this.occupation = "";
            this.pwd_status = "";
            this.address = "";
            this.profile_pic = "";
            this.national_id = "";
            this.citizenship = "";

            this.errors = [];
        },
    },

    mounted() {
        this.fetchZones();
        if (localStorage.getItem("user2") != null) {
            this.setFields();
        }
    },
};
</script>