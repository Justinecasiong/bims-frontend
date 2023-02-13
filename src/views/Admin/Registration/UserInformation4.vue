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
                <div v-if="!loading">
                    <h5>Resident Registration - Set up Profile Picture</h5>

                    <div class="container">
                        <div class="mt-3 loading-bar3">
                            <h6 class="text-center" style="color: white">
                                90%
                            </h6>
                        </div>
                        <div class="text-center mt-4">
                            <img
                                v-if="profile_pic == null"
                                class="profile-image"
                                :src="
                                    require('../../../assets/images/profile_image.png')
                                "
                                width="300"
                            />
                            <img
                                v-if="profile_pic != null"
                                class="profile-image"
                                :src="profile_pic"
                                width="300"
                            />
                            <div class="form-group">
                                <input
                                    v-on:change="onProfilePicChange($event)"
                                    type="file"
                                    id="imageFile"
                                    accept="image/png, image/jpeg"
                                />
                            </div>
                        </div>
                        <button
                            class="btn btn-success mt-4"
                            style="width: 100; float: right"
                            @click="submitPage()"
                        >
                            Submit
                        </button>
                    </div>
                </div>
                <div v-if="loading" class="text-center">
                    <div
                        class="spinner-border text-primary lg mt-3"
                        role="status"
                        style="width: 15rem; height: 15rem"
                    ></div>
                    <h1 class="mt-5">Saving your data...</h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../../axios";
export default {
    data() {
        return {
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
            citizenship: null,
            voter_status: null,
            identified_as: null,
            email: null,
            contact_num: null,
            occupation: null,
            pwd_status: null,
            address: null,
            profile_pic: null,
            identification: "",
            education_status: "",
            income: "",
            pregnant: "No",
            due_date: "No",
            picture: "",

            loading: false,
        };
    },

    methods: {
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

        async submitPage() {
            this.loading = true;
            this.setFields();
            const data = {
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
                citizenship: this.citizenship,
                voter_status: this.voter_status,
                identified_as: this.identified_as,
                email: this.email,
                contact_num: this.contact_num,
                occupation: this.occupation,
                pwd_status: this.pwd_status,
                address: this.address,
                profile_pic: this.profile_pic,
                identifation: this.identification,
                educational_status: this.education_status,
                yearly_income: this.income,
                pregnant: this.pregnant,
                due_date: this.due_date,
                identification_img: this.picture,
                status: "Approved",
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .post("/resident", data)
                .then(() => {
                    localStorage.clear("user1");
                    localStorage.clear("user3");
                    localStorage.clear("user2");
                    setTimeout(() => {
                        this.$router.push("/register/confirmation");
                    }, 5000);
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
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

            const data2 = JSON.parse(localStorage.getItem("user2"));
            this.zone_id = data2.zone_id;
            this.voter_status = data2.voter_status;
            this.identified_as = data2.identified_as;
            this.email = data2.email;
            this.contact_num = data2.contact_num;
            this.occupation = data2.occupation;
            this.pwd_status = data2.pwd_status;
            this.address = data2.address;

            const data3 = JSON.parse(localStorage.getItem("user3"));
            this.identification = data3.identification;
            this.education_status = data3.education_status;
            this.income = data3.income;
            this.pregnant = data3.pregnant;
            this.due_date = data3.due_date;
            this.picture = data3.picture;
        },

        resetFields() {
            this.id = null;
            this.zone_id = null;
            this.first_name = null;
            this.middle_name = null;
            this.income = null;
            this.alias = null;
            this.place_of_birth = null;
            this.birthdate = null;
            this.age = null;
            this.civil_status = null;
            this.sex = null;
            this.voter_status = null;
            this.identified_as = null;
            this.email = null;
            this.contact_num = null;
            this.occupation = null;
            this.pregnant = null;
            this.address = null;
            this.profile_pic = null;
            this.national_id = null;
            this.citizenship = null;

            this.errors = [];
        },
    },
};
</script>