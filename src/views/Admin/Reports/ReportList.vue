<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-10">
                    <h1>{{ officials.fullname }}</h1>
                </div>
            </div>
            <div class="row">
                <center>
                    <h1>
                        Reports on
                        {{ officials.chairmanship.chairmanship_description }}
                    </h1>
                </center>
            </div>

            <div class="row">
                <div
                    class="col-md-4"
                    v-if="
                        officials.position.position_description == 'Treasurer'
                    "
                >
                    <div class="form-group mb-3">
                        <label class="filter">Type of report:</label>
                        <select
                            class="form-select"
                            id="inputGroupSelect01"
                            v-model="report_type"
                            v-on:click="fetchReportType()"
                        >
                            <option :value="'Summary Collection'">
                                Summary Collection
                            </option>
                            <option :value="'Monthly Report'">
                                Monthly Report
                            </option>
                            <option :value="'Annual Budget'">
                                Annual Budget
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col"></div>
                <div class="col-md-4 mr-0">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="findReports()"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <button class="btn btn-primary mb-3" v-b-modal.modal-add>
                Add Report
            </button>
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
                        <th scope="col">File name</th>
                        <th scope="col">Date uploaded</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(report, index) in reports" :key="report.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <th>{{ report.file_name }}</th>
                        <th>{{ moment(report.create_at).format("LL") }}</th>
                        <td>
                            <button
                                class="btn btn-primary"
                                @click="download(report)"
                            >
                                <i class="fas fa-download"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setItems(report)"
                            >
                                <i class="fas fa-trash"></i>
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
                    v-on:input="findReports()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-add"
            size="md"
            title="User Status Update"
            centered
            @ok.prevent="formSubmit()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="first-name" class="control-label"
                    >Upload document:
                </label>
                <input
                    type="file"
                    class="form-control"
                    v-on:change="onFileChange"
                />
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete File"
            centered
            @ok.prevent="deleteFile()"
            ok-title="Delete"
        >
            Are you sure you want to delete this file?
        </b-modal>
    </div>
</template>

<script>
import axios from "../../../axios";
import moment from "moment";
export default {
    props: ["id"],

    data() {
        return {
            officials: [],
            reports: [],

            report_id: null,
            loading: false,
            search: "",
            report_type: "",

            currentPage: 1,
            rows: 0,
            perPage: 0,

            moment: moment,
        };
    },

    methods: {
        async findOfficial() {
            this.loading = true;
            var data = {
                id: this.id,
            };
            await axios
                .post(`/find-officials-id`, data)
                .then((response) => {
                    this.officials = response.data;
                    if (
                        response.data.position.position_description ==
                        "Treasurer"
                    ) {
                        this.report_type = "Summary Collection";
                        this.fetchReportType();
                    } else {
                        this.findReports();
                        this.report_type = "file";
                    }
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async findReports() {
            this.loading = true;
            // var data = {
            //     id: this.id,
            // };
            await axios
                .get(
                    `/file?page=${this.currentPage}&search=${this.search}&id=${this.id}`
                )
                .then((response) => {
                    this.reports = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchReportType() {
            this.loading = true;
            await axios
                .get(
                    `/report-type?page=${this.currentPage}&search=${this.search}&id=${this.id}&report_type=${this.report_type}`
                )
                .then((response) => {
                    this.reports = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        onFileChange(e) {
            console.log(e.target.files[0]);
            this.file = e.target.files[0];
        },

        formSubmit() {
            let formData = new FormData();
            formData.append("file", this.file);

            axios
                .post(
                    `/formSubmit?official_id=${this.id}&report_type=${
                        this.report_type
                    }&remember_token=${localStorage.getItem("token")}`,
                    formData
                )
                .then(() => {
                    this.findOfficial();
                    this.$toast.success("Document has been uploaded.");
                    if (
                        this.officials.position.position_description ==
                        "Treasurer"
                    ) {
                        this.report_type = "Summary Collection";
                        this.fetchReportType();
                    } else {
                        this.findReports();
                        this.report_type = "file";
                    }
                    this.$bvModal.hide("modal-add");
                });
        },

        async download(report) {
            await axios
                .get("/download?fileName=" + report.file_name, {
                    responseType: "blob",
                })
                .then((response) => {
                    var fileURL = window.URL.createObjectURL(
                        new Blob([response.data])
                    );
                    var fileLink = document.createElement("a");
                    fileLink.href = fileURL;
                    fileLink.setAttribute("download", report.file_name);
                    document.body.appendChild(fileLink);
                    fileLink.click();
                });
        },

        async deleteFile() {
            await axios
                .delete(
                    `/file/${
                        this.report_id
                    }?remember_token=${localStorage.getItem("token")}`
                )
                .then(() => {
                    this.$toast.success("Announcement has been deleted.");
                    this.findReports();
                    this.$bvModal.hide("modal-delete");
                });
        },

        setItems(data) {
            this.report_id = data.id;
        },
    },

    mounted() {
        this.findOfficial();
    },
};
</script>
