<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>COVID-19 Vaccination Status</h1>
                </div>
                <div class="col search" v-if="permission == 'admin'">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchCovid()"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="table-container table-responsive-xxl shadow">
            <div class="d-flex justify-content-center" v-if="loading">
                <div
                    class="spinner-border text-center mt-3"
                    role="status"
                ></div>
            </div>
            <table
                class="table table-striped table-hover table-sm"
                v-if="loading == false"
            >
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Fullname</th>
                        <th scope="col">Type of Vaccine</th>
                        <th scope="col">No. of Dose</th>
                        <th scope="col">Type of Booster</th>
                        <th scope="col">Reason</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(covid, index) in covids" :key="covid.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>
                            {{ covid.resident.first_name }}
                            {{ covid.resident.last_name }}
                        </td>
                        <td>{{ covid.vaccination_type }}</td>
                        <td>{{ covid.dose_num }}</td>
                        <td>{{ covid.booster_type }}</td>
                        <td>{{ covid.reason }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setCovid(covid)"
                            >
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="mt-3">
                <b-pagination
                    v-model="currentPage"
                    prev-text="Prev"
                    next-text="Next"
                    :total-rows="rows"
                    :per-page="perPage"
                    align="center"
                    v-on:input="fetchCovid()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            class="edit_modal"
            id="modal-edit"
            title="Edit COVID Details"
            size="xl"
            centered
            @ok.prevent="updateCovid()"
            ok-title="Update"
        >
            <div class="row">
                <div class="col-lg-4">
                    <div class="row text-center">
                        <img
                            v-if="profile_pic == null"
                            class="profile-image"
                            :src="
                                require('../../assets/images/profile_image.png')
                            "
                        />
                        <img
                            v-if="profile_pic != null"
                            class="profile-image"
                            :src="profile_pic"
                        />
                    </div>
                </div>

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
                                    placeholder="Enter Middle Name"
                                    v-model="first_name"
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Middle Name:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="first-name"
                                    placeholder="Enter Middle Name"
                                    v-model="middle_name"
                                    disabled
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Last Name:
                                </label>
                                <input
                                    type="text"
                                    class="form-control"
                                    id="first-name"
                                    placeholder="Enter Middle Name"
                                    v-model="last_name"
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="types" class="control-label">
                                    Type of Vaccine:
                                </label>
                                <select
                                    class="form-select"
                                    name="types"
                                    id="types"
                                    v-model="vaccination_type"
                                >
                                    <option value="" disabled selected>
                                        Select Type of Vaccine
                                    </option>
                                    <option value="Pfizer">Pfizer</option>
                                    <option value="Moderna">Moderna</option>
                                    <option value="Astrazeneca">
                                        Astrazeneca
                                    </option>
                                    <option value="Johnson & Johnson">
                                        Johnson & Johnson
                                    </option>
                                    <option value="Sinovac">Sinovac</option>
                                    <option value="Unvaccinated">
                                        Unvaccinated
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="doses" class="control-label">
                                    No. of Doses:
                                </label>
                                <select
                                    class="form-select"
                                    name="doses"
                                    id="doses"
                                    v-model="dose_num"
                                >
                                    <option value="" disabled selected>
                                        Select No. of Doses
                                    </option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="booster" class="control-label">
                                    Type of Booster:
                                </label>
                                <select
                                    class="form-select"
                                    name="types"
                                    id="types"
                                    v-model="booster_type"
                                >
                                    <option value="" disabled selected>
                                        Select Type of Booster
                                    </option>
                                    <option value="Pfizer">Pfizer</option>
                                    <option value="Moderna">Moderna</option>
                                    <option value="Astrazeneca">
                                        Astrazeneca
                                    </option>
                                    <option value="Johnson & Johnson">
                                        Johnson & Johnson
                                    </option>
                                    <option value="Sinovac">Sinovac</option>
                                    <option value="Unvaccinated">
                                        Unvaccinated
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Reason (if Unvaccinated):
                                </label>
                                <select
                                    class="form-select"
                                    name="reason"
                                    id="reason"
                                    v-model="reason"
                                >
                                    <option value="" disabled selected>
                                        Select Reason
                                    </option>
                                    <option
                                        value="Fare const: Unability to get to the vaccin site"
                                    >
                                        Fare const: Unability to get to the
                                        vaccin site
                                    </option>
                                    <option
                                        value="Comorbities: Fear of side effects and health risk."
                                    >
                                        Comorbities: Fear of side effects and
                                        health risk.
                                    </option>
                                    <option
                                        value="Lack trust in the brands of vaccine."
                                    >
                                        Lack trust in the brands of vaccine.
                                    </option>
                                    <option
                                        value="Covid-19 is not considerable threat."
                                    >
                                        Covid-19 is not considerable threat.
                                    </option>
                                    <option value="None">None</option>
                                </select>
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
    props: ["ids"],
    data() {
        return {
            id: null,
            vaccination_type: null,
            dose_num: null,
            booster_type: null,
            reason: null,

            search: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            profile_pic: null,

            covids: {},

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),
        };
    },

    computed: {},

    methods: {
        async findCovid() {
            this.loading = true;

            const data = {
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .post(`/find-covid?page=${this.currentPage}`, data)
                .then((response) => {
                    this.covids = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchCovid() {
            this.loading = true;
            await axios
                .get(`/covid?page=${this.currentPage}&search=${this.ids}`)
                .then((response) => {
                    this.covids = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async createCovid() {
            const data = {
                vaccination_type: this.vaccination_type,
                dose_num: this.dose_num,
                booster_type: this.booster_type,
                reason: this.reason,
            };

            let res = await this.$store.dispatch("COVID/STORE_COVID", data);

            if (res.status == 200) {
                this.$toast.success("Covid Status data has been created.");
                this.fetchCovid();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-add");
        },

        setCovid(data) {
            this.resetFields();
            if (data.resident.profile_pic != null) {
                this.profile_pic =
                    "http://127.0.0.1:8000/img/" + data.resident.profile_pic;
            } else {
                this.profile_pic = data.resident.profile_pic;
            }

            this.id = data.id;
            this.vaccination_type = data.vaccination_type;
            this.dose_num = data.dose_num;
            this.booster_type = data.booster_type;
            this.reason = data.reason;

            this.first_name = data.resident.first_name;
            this.middle_name = data.resident.middle_name;
            this.last_name = data.resident.last_name;
        },

        async updateCovid() {
            const data = {
                id: this.id,
                vaccination_type: this.vaccination_type,
                dose_num: this.dose_num,
                booster_type: this.booster_type,
                reason: this.reason,
            };

            let res = await this.$store.dispatch("COVID/UPDATE_COVID", data);

            if (res.status == 200) {
                if (this.permission != "resident") {
                    this.$toast.success("Covid Status data has been updated.");
                    this.fetchCovid();
                    this.resetFields();
                } else if (this.permission == "resident") {
                    this.$toast.success("Covid Status data has been updated.");
                    this.findCovid();
                    this.resetFields();
                }
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-edit");
        },

        async resetFields() {
            this.vaccination_type = null;
            this.dose_num = null;
            this.booster_type = null;
            this.reason = null;
        },
    },

    mounted() {
        if (this.permission != "resident") {
            this.fetchCovid();
        } else if (this.permission == "resident") {
            this.findCovid();
        }
    },
};
</script>

