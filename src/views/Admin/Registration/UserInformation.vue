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
                                required
                            />
                        </div>
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
                                required
                            />
                        </div>
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
                                required
                            />
                        </div>
                        <div class="row">
                            <div class="col-6">
                                <div class="form-group">
                                    <label for="name" class="control-label">
                                        Citizenship:
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        id="name"
                                        placeholder="Enter Citizenship"
                                        v-model="citizenship"
                                        required
                                    />
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="form-group">
                                    <label
                                        for="birthdate"
                                        class="control-label"
                                    >
                                        Birthdate:
                                    </label>
                                    <input
                                        type="date"
                                        class="form-control"
                                        id="birthdate"
                                        placeholder="Enter Birthdate"
                                        v-model="birthdate"
                                        required
                                    />
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
                                    <label
                                        for="civil-status"
                                        class="control-label"
                                    >
                                        Civil Status:
                                    </label>
                                    <select
                                        class="form-select"
                                        name="civil-status"
                                        id="civil_status"
                                        v-model="civil_status"
                                        required
                                    >
                                        <option value="Single">Single</option>
                                        <option value="Married">Married</option>
                                        <option value="Divorced">
                                            Divorced
                                        </option>
                                        <option value="Widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <div class="form-group">
                                    <label
                                        for="first-name"
                                        class="control-label"
                                    >
                                        Gender:
                                    </label>
                                    <select
                                        class="form-select"
                                        name="sex"
                                        id="sex"
                                        v-model="sex"
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="LGBTQ">LGBTQ</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <button
                                    class="btn btn-primary mt-4"
                                    style="width: 100; float: right"
                                    @click="nextPage()"
                                >
                                    Next
                                </button>
                                <button
                                    class="btn btn-warning mt-4"
                                    style="width: 100; float: right"
                                    @click="resetFields()"
                                >
                                    Clear
                                </button>
                                <button
                                    class="btn btn-secondary mt-4"
                                    style="width: 100; float: right"
                                    @click="cancelRegistration()"
                                >
                                    Cancel
                                </button>
                            </div>
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
            zone_id: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            alias: "",
            place_of_birth: "",
            birthdate: "",
            age: "",
            civil_status: "",
            sex: "",
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
    methods: {
        nextPage() {
            if (
                this.first_name == "" ||
                this.last_name == "" ||
                this.place_of_birth == "" ||
                this.birthdate == "" ||
                this.civil_status == "" ||
                this.sex == "" ||
                this.citizenship == ""
            ) {
                this.$toast.error("Invalid input!");
            } else {
                this.computeAge();
                const data = {
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    alias: this.alias,
                    place_of_birth: this.place_of_birth,
                    birthdate: this.birthdate,
                    age: this.age,
                    civil_status: this.civil_status,
                    sex: this.sex,
                    citizenship: this.citizenship,
                };

                localStorage.setItem("user1", JSON.stringify(data));
                this.$router.push("/register/user-resident-information");
            }
        },

        setFields() {
            const data = JSON.parse(localStorage.getItem("user1"));
            this.first_name = data.first_name;
            this.middle_name = data.middle_name;
            this.last_name = data.last_name;
            this.alias = data.alias;
            this.place_of_birth = data.place_of_birth;
            this.birthdate = data.birthdate;
            this.age = data.age;
            this.civil_status = data.civil_status;
            this.sex = data.sex;
            this.citizenship = data.citizenship;
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
            this.citizenship = "";
        },

        cancelRegistration() {
            localStorage.clear("user1");
            localStorage.clear("user2");
            localStorage.clear("user3");

            this.$router.push("/");
        },

        computeAge() {
            const today = new Date();
            this.age =
                today.getFullYear() - new Date(this.birthdate).getFullYear();
            const m = today.getMonth() - new Date(this.birthdate).getMonth();
            if (
                m < 0 ||
                (m === 0 &&
                    today.getDate() < new Date(this.birthdate).getDate())
            ) {
                this.age = this.age - 1;
            }
        },
    },

    mounted() {
        if (localStorage.getItem("user1") != null) {
            this.setFields();
        }
    },
};
</script>