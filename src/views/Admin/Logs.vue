<template>
    <div class="chairmanship">
        <div class="page-header">
            <div class="row">
                <div class="col-10">
                    <h1>Logs</h1>
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
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">User</th>
                        <th scope="col">Action</th>
                        <th scope="col">Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="log in logs" :key="log.id">
                        <td>{{ log.user }}</td>
                        <td>{{ log.action }}</td>
                        <td>{{ moment(log.created_at).format("LLL") }}</td>
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
                    v-on:input="fetchLogs()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import moment from "moment";
export default {
    data() {
        return {
            logs: [],
            currentPage: 1,
            rows: 0,
            perPage: 0,

            moment: moment,
            loading: false,
        };
    },
    methods: {
        async fetchLogs() {
            this.loading = true;
            await axios
                .get(`/logs?page=${this.currentPage}&search=${this.ids}`)
                .then((response) => {
                    this.logs = response.data.data;
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
        this.fetchLogs();
    },
};
</script>