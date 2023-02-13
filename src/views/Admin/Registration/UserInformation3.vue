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
                    <div class="mt-3 loading-bar2">
                        <h6 class="text-center" style="color: white">75%</h6>
                    </div>
                    <div class="form-group">
                        <label for="first-name" class="control-label">
                            Type of ID:
                        </label>
                        <select
                            class="form-select"
                            name="zone"
                            id="zone"
                            v-model="identification"
                        >
                            <option value="National ID">National ID</option>
                            <option value="SSS">SSS</option>
                            <option value="Philhealth">Philhealth</option>
                            <option value="PAG-IBIG">PAG-IBIG</option>
                            <option value="Voters ID">Voters ID</option>
                            <option value="School ID">School ID</option>
                        </select>
                        <div class="form-group">
                            <input
                                v-on:change="onProfilePicChange($event)"
                                type="file"
                                id="imageFile"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="pregnant" class="control-label">
                            Educational Status:
                        </label>
                        <select
                            class="form-select"
                            name="pregnant"
                            id="pregnant"
                            v-model="education_status"
                        >
                            <option value="Elementary">Elementary</option>
                            <option value="High-school">High-school</option>
                            <option value="Undergraduate (Bachelor Degree)">
                                Undergraduate (Bachelor Degree)
                            </option>
                            <option value="Postgraduate (Master Degree)">
                                Postgraduate (Master Degree)
                            </option>
                            <option value="Doctoral (PhD)">
                                Doctoral (PhD)
                            </option>
                        </select>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="income" class="control-label">
                                    Yearly Income:
                                </label>
                                <select
                                    class="form-select"
                                    name="income"
                                    id="income"
                                    v-model="income"
                                >
                                    <option value="N/A">N/A</option>
                                    <option value="10k-20k">10k-20k</option>
                                    <option value="30-50k">30-50k</option>
                                    <option value="50k-80k">50k-80k</option>
                                    <option value="90k-100k">90k-100k</option>
                                    <option value="100k- above">
                                        100k- above
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4" v-if="user1.sex == 'Female'">
                            <div class="form-group">
                                <label for="pregnant" class="control-label">
                                    Are you Pregnant?:
                                </label>
                                <select
                                    class="form-select"
                                    name="pregnant"
                                    id="pregnant"
                                    v-model="pregnant"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4" v-if="user1.sex == 'Female'">
                            <div class="form-group">
                                <label for="due_date" class="control-label">
                                    Due Date:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="due_date"
                                    placeholder="Enter Last Name"
                                    v-model="due_date"
                                />
                            </div>
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
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            identification: "",
            education_status: "",
            income: "",
            pregnant: "No",
            due_date: "No",
            picture: "",
            user1: JSON.parse(localStorage.getItem("user1")),
        };
    },

    methods: {
        nextPage() {
            if (this.education_status == "") {
                this.$toast.error("Educational status is required");
            } else {
                const data = {
                    identification: this.identification,
                    education_status: this.education_status,
                    income: this.income,
                    pregnant: this.pregnant,
                    due_date: this.due_date,
                    picture: this.picture,
                };
                localStorage.setItem("user3", JSON.stringify(data));
                this.$router.push("/register/user-profile-picture");
            }
        },

        backPage() {
            this.$router.push("/register/user-resident-information");
        },

        onProfilePicChange(e) {
            if (e.target?.files[0]) {
                this.picture = null;
                this.picture = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.picture);
                reader.onload = (e) => {
                    this.picture = e.target.result;
                };
            }
        },

        setFields() {
            const data3 = JSON.parse(localStorage.getItem("user3"));
            this.identification = data3.identification;
            this.education_status = data3.education_status;
            this.income = data3.income;
            this.pregnant = data3.pregnant;
            this.due_date = data3.due_date;
            this.picture = data3.picture;
        },

        resetFields() {
            this.identification = "";
            this.education_status = "";
            this.income = "";
            this.pregnant = "";
            this.due_date = "";
            this.picture = "";
        },
    },

    mounted() {
        if (localStorage.getItem("user3") != null) {
            this.setFields();
        }
    },
};
</script>