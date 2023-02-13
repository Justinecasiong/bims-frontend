<template>
    <div class="row">
        <div class="col">
            <div class="container">
                <div class="page-header">
                    <div class="row">
                        <div class="col-lg-8 col-md-5">
                            <h1>Blotter/Incident Complaint</h1>
                        </div>
                        <!-- <div class="col search">
                            <div class="input-group">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Search"
                                    v-model="search"
                                    v-on:input="fetchBlotter()"
                                />
                            </div>
                        </div> -->
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div
                            class="card card-round text-white"
                            style="background-color: #b74545"
                        >
                            <card-body>
                                <div class="row">
                                    <div class="col"></div>
                                    <div class="col">
                                        <p>Active</p>
                                        <p>{{ this.active_count }}</p>
                                    </div>
                                </div>
                                Active Case
                            </card-body>
                        </div>
                    </div>
                    <div class="col">
                        <div
                            class="card card-round text-white"
                            style="background-color: #97b495"
                        >
                            <card-body>
                                <div class="row">
                                    <div class="col"></div>
                                    <div class="col">
                                        <p>Settled</p>
                                        <p>{{ this.settled_count }}</p>
                                    </div>
                                </div>
                                Settled Case
                            </card-body>
                        </div>
                    </div>
                    <div class="col">
                        <div
                            class="card card-round text-white"
                            style="background-color: #87bacd"
                        >
                            <card-body>
                                <div class="row">
                                    <div class="col"></div>
                                    <div class="col">
                                        <p>Scheduled</p>
                                        <p>{{ this.scheduled_count }}</p>
                                    </div>
                                </div>
                                Scheduled Case
                            </card-body>
                        </div>
                    </div>
                </div>
                <div
                    class="table-container-blotter table-responsive-xxl shadow"
                >
                    <div class="other-btn" v-if="permission != 'admin'">
                        <div class="row">
                            <div class="col">
                                <button
                                    class="btn btn-primary"
                                    v-b-modal.modal-add
                                >
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
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
                                <th scope="col">Complainant</th>
                                <th scope="col">Respondent</th>
                                <th scope="col">Victim(s)</th>
                                <th scope="col">Blotter/Incident</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(blotter, index) in blotters"
                                :key="blotter.id"
                            >
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ blotter.complainant }}</td>
                                <td>{{ blotter.respondent }}</td>
                                <td>{{ blotter.victims }}</td>
                                <td>{{ blotter.type }}</td>
                                <td>{{ blotter.blotter_status }}</td>
                                <td>
                                    <button
                                        class="btn btn-primary"
                                        @click="setBlotter(blotter)"
                                        v-b-modal.modal-edit
                                    >
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button
                                        class="btn btn-success"
                                        @click="printCertificate(blotter)"
                                    >
                                        <i class="fas fa-file"></i>
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
            </div>
        </div>

        <b-modal
            class="add_modal"
            id="modal-add"
            title="Manage Blotter"
            size="lg"
            centered
            @ok.prevent="createBlotter()"
            ok-title="Save"
        >
            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="complainant" class="control-label">
                            Complainant:
                        </label>
                        <input
                            v-model="complainant"
                            type="text"
                            class="form-control"
                            id="complainant"
                            placeholder="Enter Complainant Name"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="respondent" class="control-label">
                            Respondent:
                        </label>
                        <input
                            v-model="respondent"
                            type="text"
                            class="form-control"
                            id="respondent"
                            placeholder="Enter Respondent Name"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="victims" class="control-label">
                            Victim(s):
                        </label>
                        <input
                            v-model="victims"
                            type="text"
                            class="form-control"
                            id="victims"
                            placeholder="Enter Victim(s) Name"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="types" class="control-label"> Type: </label>
                        <select
                            class="form-select"
                            name="types"
                            id="types"
                            v-model="type"
                        >
                            <option value="" disabled selected>
                                Select Blotter Type
                            </option>
                            <option value="Amicable">Amicable</option>
                            <option value="Incident">Incident</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="location" class="control-label">
                            Location:
                        </label>
                        <input
                            v-model="location"
                            type="text"
                            class="form-control"
                            id="location"
                            placeholder="Enter Location"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="date" class="control-label"> Date: </label>
                        <input
                            v-model="date"
                            type="date"
                            class="form-control"
                            id="date"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="time" class="control-label"> Time: </label>
                        <input
                            v-model="time"
                            type="time"
                            class="form-control"
                            id="time"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="types" class="control-label">
                            Blotter Status:
                        </label>
                        <select
                            class="form-select"
                            name="types"
                            id="types"
                            v-model="blotter_status"
                        >
                            <option value="Active" selected>Active</option>
                            <option value="Settled">Settled</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="details" class="control-label">
                        Details:
                    </label>
                    <textarea
                        v-model="details"
                        class="form-control"
                        id="details"
                        placeholder="Enter Blotter or Incident Report"
                    ></textarea>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="edit_modal"
            id="modal-edit"
            title="Edit Blotter Details"
            size="lg"
            centered
            @ok.prevent="updateBlotter()"
            ok-title="Update"
        >
            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="complainant" class="control-label">
                            Complainant:
                        </label>
                        <input
                            v-model="complainant"
                            type="text"
                            class="form-control"
                            id="complainant"
                            placeholder="Enter Complainant Name"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="respondent" class="control-label">
                            Respondent:
                        </label>
                        <input
                            v-model="respondent"
                            type="text"
                            class="form-control"
                            id="respondent"
                            placeholder="Enter Respondent Name"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="victims" class="control-label">
                            Victim(s):
                        </label>
                        <input
                            v-model="victims"
                            type="text"
                            class="form-control"
                            id="victims"
                            placeholder="Enter Victim(s) Name"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="types" class="control-label"> Type: </label>
                        <select
                            class="form-select"
                            name="types"
                            id="types"
                            v-model="type"
                        >
                            <option value="" disabled selected>
                                Select Blotter Type
                            </option>
                            <option value="Amicable">Amicable</option>
                            <option value="Incident">Incident</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="location" class="control-label">
                            Location:
                        </label>
                        <input
                            v-model="location"
                            type="text"
                            class="form-control"
                            id="location"
                            placeholder="Enter Location"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="date" class="control-label"> Date: </label>
                        <input
                            v-model="date"
                            type="date"
                            class="form-control"
                            id="date"
                        />
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="time" class="control-label"> Time: </label>
                        <input
                            v-model="time"
                            type="time"
                            class="form-control"
                            id="time"
                        />
                    </div>
                </div>
                <div class="col-sm-4 col-md-6 col-lg-6">
                    <div class="form-group">
                        <label for="types" class="control-label">
                            Blotter Status:
                        </label>
                        <select
                            class="form-select"
                            name="types"
                            id="types"
                            v-model="blotter_status"
                        >
                            <option value="Active" selected>Active</option>
                            <option value="Settled">Settled</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="details" class="control-label">
                        Details:
                    </label>
                    <textarea
                        v-model="details"
                        class="form-control"
                        id="details"
                        placeholder="Enter Blotter or Incident Report"
                    ></textarea>
                </div>
            </div>
        </b-modal>
        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Blotter Details"
            centered
            @ok.prevent="deleteBlotter()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>


<script>
import axios from "../../axios";
export default {
    data() {
        return {
            id: null,
            complainant: null,
            respondent: null,
            victims: null,
            type: null,
            location: null,
            date: null,
            time: null,
            blotter_status: null,
            details: null,

            blotters: {},

            search: "",

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,
            permission: localStorage.getItem("permission"),
        };
    },

    computed: {
        active_count() {
            return this.$store.getters["BLOTTER/GET_ACTIVE_COUNT"];
        },

        settled_count() {
            return this.$store.getters["BLOTTER/GET_SETTLED_COUNT"];
        },

        scheduled_count() {
            return this.$store.getters["BLOTTER/GET_SCHEDULED_COUNT"];
        },
    },

    methods: {
        async fetchBlotter() {
            this.loading = true;
            await axios
                .get(`/blotter?page=${this.currentPage}&search=${this.search}`)
                .then((response) => {
                    this.blotters = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchCountCases() {
            await this.$store.dispatch("BLOTTER/FETCH_ACTIVE_COUNT");
            await this.$store.dispatch("BLOTTER/FETCH_SCHEDULED_COUNT");
            await this.$store.dispatch("BLOTTER/FETCH_SETTLED_COUNT");
        },

        async fetchSettledCases() {
            await this.$store.dispatch(
                "BLOTTER/FETCH_SETTLED_COUNT",
                this.search
            );
        },

        async fetchScheduledCases() {
            await this.$store.dispatch(
                "BLOTTER/FETCH_SCHEDULED_COUNT",
                this.search
            );
        },

        async createBlotter() {
            const data = {
                complainant: this.complainant,
                respondent: this.respondent,
                victims: this.victims,
                type: this.type,
                location: this.location,
                date: this.date,
                time: this.time,
                blotter_status: this.blotter_status,
                details: this.details,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch("BLOTTER/STORE_BLOTTER", data);

            if (res.status == 200) {
                this.$toast.success("Blotter report has been created.");
                this.fetchBlotter();
                this.fetchCountCases();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-add");
        },

        printCertificate(data) {
            this.$router.push({
                path: `/certificate/blotter/${data.id}`,
            });
        },

        setBlotter(data) {
            this.id = data.id;
            this.complainant = data.complainant;
            this.respondent = data.respondent;
            this.victims = data.victims;
            this.type = data.type;
            this.location = data.location;
            this.date = data.date;
            this.time = data.time;
            this.blotter_status = data.blotter_status;
            this.details = data.details;
        },

        async updateBlotter() {
            const data = {
                id: this.id,
                complainant: this.complainant,
                respondent: this.respondent,
                victims: this.victims,
                type: this.type,
                location: this.location,
                date: this.date,
                time: this.time,
                blotter_status: this.blotter_status,
                details: this.details,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch(
                "BLOTTER/UPDATE_BLOTTER",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Blotter report has been updated.");
                this.fetchBlotter();
                this.fetchCountCases();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-edit");
        },

        async deleteBlotter() {
            await axios
                .delete(
                    `/blotter/${this.id}?remember_token=${localStorage.getItem(
                        "token"
                    )}`
                )
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.error(
                            "Blotter records data has been deleted."
                        );
                        this.fetchBlotter();
                        this.fetchCountCases();
                        this.resetFields();
                    } else {
                        this.$toast.error("Something went wrong.");
                    }

                    this.$bvModal.hide("modal-delete");
                });
        },

        openModalAdd() {
            this.resetFields();
            this.$bvModal.show("modal-add");
        },

        async resetFields() {
            this.id = null;
            this.complainant = null;
            this.respondent = null;
            this.victims = null;
            this.type = null;
            this.location = null;
            this.date = null;
            this.time = null;
            this.blotter_status = null;
            this.details = null;
        },
    },

    mounted() {
        this.fetchBlotter();
        this.fetchCountCases();
    },
};
</script>
    
