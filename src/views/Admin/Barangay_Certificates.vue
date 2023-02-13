<template>
    <div class="container">
        <div class="page-header">
            <h1>Barangay Certificates</h1>
            <div class="row">
                <div class="dropdown col-lg-6 col-md-5">
                    <div class="form-group mb-3">
                        <label class="filter">Filter Zone:</label>
                        <select
                            class="form-select"
                            id="inputGroupSelect01"
                            v-model="search_zone"
                            v-on:click="fetchResident()"
                        >
                            <option :value="''" selected>All Zones</option>
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
                <div class="col">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchResident()"
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
                        <th scope="col">Zone</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(resident, index) in fetchResidents"
                        :key="resident.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>
                            {{ resident.first_name }}
                            {{ resident.middle_name.charAt(0) }}.
                            {{ resident.last_name }}
                        </td>
                        <td>{{ resident.zones.zone_description }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                @click="goToCertificates(resident)"
                            >
                                <i class="fas fa-file"></i>
                            </button>
                            <button
                                class="btn btn-success"
                                @click="goToClearance(resident)"
                            >
                                <i class="fas fa-file"></i>
                            </button>
                            <button
                                class="btn btn-warning"
                                @click="goToIndigency(resident)"
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
                    v-on:input="fetchResident()"
                    style="align-items: flex-end"
                ></b-pagination>
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
            profile_pic: null,
            national_id: null,
            citizenship: null,

            residents: [],

            search: "",
            search_zone: "",

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,
        };
    },

    computed: {
        zones() {
            return this.$store.getters["ZONES/GET_ZONES"];
        },

        fetchResidents() {
            return this.residents.filter((data) => {
                return data.zone_id.toString().match(this.search_zone);
            });
        },
    },

    methods: {
        async fetchResident() {
            this.loading = true;
            await axios
                .get(`/resident?page=${this.currentPage}&search=${this.search}`)
                .then((response) => {
                    this.residents = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

        goToCertificates(data) {
            this.$router.push({
                path: `/certificate/barangay_certificates/${data.id}`,
            });
        },

        goToClearance(data) {
            this.$router.push({
                path: `/certificate/barangay_clearance/${data.id}`,
            });
        },

        goToIndigency(data) {
            this.$router.push({
                path: `/certificate/indigency/${data.id}`,
            });
        },
    },

    mounted() {
        this.fetchResident();
        this.fetchZones();
    },
};
</script>

