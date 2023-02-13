<template>
    <div class="household">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Household</h1>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div class="other-btn">
                <div class="row">
                    <div class="col">
                        <button class="btn btn-primary" v-b-modal.modal-add>
                            A
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Zone</th>
                        <th scope="col">Total No. of Household</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody v-if="this.households == 0">
                    <div class="table_status">
                        <h6>No saved records.</h6>
                    </div>
                </tbody>
                <tbody v-if="this.households != 0">
                    <tr
                        v-for="(household, index) in households"
                        :key="household.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ household.zones.zone_description }}</td>
                        <td>{{ household.total_no }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setHouseholds(household)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setHouseholds(household)"
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
                    v-on:input="fetchHousholds()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-edit"
            size="md"
            title="Edit Zone"
            centered
            @ok.prevent="updateHousholds()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="zone" class="control-label"> Zone: </label>
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
            </div>
            <div class="form-group">
                <label for="total" class="control-label">
                    Total No. of Household:
                </label>
                <input
                    v-model="total_no"
                    type="number"
                    class="form-control"
                    name="total"
                    id="total"
                />
            </div>
        </b-modal>

        <b-modal
            id="modal-add"
            size="md"
            title="Add Zone"
            centered
            @ok.prevent="createHousholds()"
            ok-title="Save"
        >
            <div class="form-group">
                <label for="zone" class="control-label"> Zone: </label>
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
            </div>
            <div class="form-group">
                <label for="total" class="control-label">
                    Total No. of Household:
                </label>
                <input
                    v-model="total_no"
                    type="number"
                    class="form-control"
                    name="total"
                    id="total"
                />
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Zone"
            centered
            @ok.prevent="deleteHousholds()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>

<script>
import axios from "../../../axios";
export default {
    data() {
        return {
            id: null,
            zone_id: null,
            total_no: null,
            households: [],
            currentPage: 1,
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
        async fetchHousholds() {
            const res = await axios
                .get(`/household?page=${this.currentPage}`)
                .then((response) => {
                    this.households = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            return res;
        },

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

        async createHousholds() {
            const data = {
                id: this.id,
                zone_id: this.zone_id,
                total_no: this.total_no,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch(
                "HOUSEHOLD/STORE_HOUSEHOLD",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Household data has been created.");
                this.fetchHousholds();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-add");
        },

        setHouseholds(data) {
            this.id = data.id;
            this.zone_id = data.zone_id;
            this.total_no = data.total_no;
        },

        async updateHousholds() {
            const data = {
                id: this.id,
                zone_id: this.zone_id,
                total_no: this.total_no,
                remember_token: localStorage.getItem("token"),
            };

            let res = await this.$store.dispatch(
                "HOUSEHOLD/UPDATE_HOUSEHOLD",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Household data has been updated.");
                this.fetchHousholds();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-edit");
        },

        async deleteHousholds() {
            await axios
                .delete(
                    `/household/${
                        this.id
                    }?remember_token=${localStorage.getItem("token")}`
                )
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.error("Household data has been deleted.");
                        this.fetchHousholds();
                        this.resetFields();
                    } else {
                        this.$toast.error("Something went wrong.");
                    }

                    this.$bvModal.hide("modal-delete");
                });
        },

        async resetFields() {
            this.zone_id = null;
            this.total_no = null;
        },
    },

    mounted() {
        this.fetchHousholds();
        this.fetchZones();
    },
};
</script>