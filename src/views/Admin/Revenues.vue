<template>
    <div class="container">
        <div class="page-header">
            <h1>Revenue Information</h1>
            <div class="row">
                <div class="dropdown col-lg-4 col-md-5">
                    <div class="form-group mb-3">
                        <label class="filter">Date range:</label>
                        <date-picker
                            v-model="date_range"
                            @change="fetchRevenue()"
                            range
                        ></date-picker>
                    </div>
                </div>
                <div class="col mt-5" v-if="permission == 'treasurer'">
                    <div
                        style="
                            text-align: right;
                            margin-bottom: 20px;
                            margin-right: 50px;
                        "
                    >
                        <button
                            class="btn btn-primary mr-3"
                            v-print="'#revenue'"
                        >
                            PRINT <i class="fas fa-print"></i>
                        </button>
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
                id="revenue"
                class="table table-striped table-hover table-sm"
                v-if="loading == false"
            >
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Recipient</th>
                        <th scope="col">Payment Details</th>
                        <th scope="col">Mode of Payment</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="revenue in revenues" :key="revenue.id">
                        <th scope="row">
                            {{ moment(revenue.create_at).format("LL") }}
                        </th>
                        <td>
                            {{ revenue.residents.first_name }}
                            {{ revenue.residents.last_name }}
                        </td>
                        <td>{{ revenue.details }}</td>
                        <td>{{ revenue.mode_of_payment }}</td>
                        <td>
                            {{ revenue.amount }}
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
                    v-on:input="fetchRevenue()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/index.css";
import axios from "../../axios";
import moment from "moment";
import Print from "vue-print-nb";
export default {
    components: { DatePicker },
    directives: {
        Print,
    },
    data() {
        return {
            revenues: [],
            date_range: null,

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),

            moment: moment,
        };
    },

    methods: {
        async fetchRevenue() {
            var data = {
                startDate: new Date(
                    new Date(this.date_range[0]).getTime() -
                        new Date(this.date_range[0]).getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .split("T")[0],
                endDate: new Date(
                    new Date(this.date_range[1]).getTime() -
                        new Date(this.date_range[1]).getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .split("T")[0],
            };
            this.loading = true;
            await axios
                .post(`/get-revenue?page=${this.currentPage}`, data)
                .then((response) => {
                    this.revenues = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchRevenues() {
            this.loading = true;
            await axios
                .get(`/revenue?page=${this.currentPage}`)
                .then((response) => {
                    this.revenues = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },
    },

    mounted() {
        this.fetchRevenue();
        this.fetchRevenues();
    },
};
</script>