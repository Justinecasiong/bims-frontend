<template>
    <div class="container">
        <div class="certification_request">
            <div class="page-header">
                <h1>Request for Certification</h1>
                <div class="row">
                    <div class="dropdown col-lg-4 col-md-5">
                        <div class="form-group mb-3">
                            <label class="filter">Filter Status:</label>
                            <select
                                class="form-select"
                                id="inputGroupSelect01"
                                v-model="search_status"
                                v-on:click="fetchCertificationRequest()"
                            >
                                <option :value="'Pending'">Pending</option>
                                <option :value="'Printed'">Printed</option>
                                <option :value="'Approved'">Approved</option>
                                <option :value="'Paid'">Paid</option>
                                <option
                                    v-if="permission != 'resident'"
                                    :value="'Unpaid Certificates'"
                                >
                                    Unpaid Certificates
                                </option>
                                <option :value="'Rejected'">Rejected</option>
                            </select>
                        </div>
                    </div>
                    <!-- <div class="col">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchCertificationRequest()"
                        />
                    </div>
                </div> -->
                </div>
            </div>
            <div class="table-container table-responsive-xxl shadow">
                <div class="other-btn">
                    <div class="row">
                        <div class="col" v-if="permission == 'resident'">
                            <button class="btn btn-primary" v-b-modal.modal-add>
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
                            <th
                                scope="col"
                                v-if="
                                    permission == 'chairperson' ||
                                    permission == 'secretary'
                                "
                            >
                                Name
                            </th>
                            <th scope="col">Certification</th>
                            <th scope="col">Date of Request</th>
                            <th
                                scope="col"
                                v-if="
                                    permission == 'chairperson' ||
                                    permission == 'secretary'
                                "
                            >
                                Purpose
                            </th>
                            <th scope="col">Status</th>
                            <th scope="col" v-if="search_status != 'Printed'">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(
                                certification_request, index
                            ) in filterStatus"
                            :key="certification_request.id"
                        >
                            <th scope="row">{{ index + 1 }}</th>
                            <td
                                v-if="
                                    permission == 'chairperson' ||
                                    permission == 'secretary'
                                "
                            >
                                {{ certification_request.resident.first_name }}
                                {{ certification_request.resident.last_name }}
                            </td>
                            <td>
                                {{
                                    certification_request.certification
                                        .certification_description
                                }}
                            </td>
                            <td v-if="search_status == 'Pending'">
                                {{
                                    moment(
                                        certification_request.expected_date
                                    ).format("LL")
                                }}
                            </td>
                            <td v-if="search_status != 'Pending'">
                                {{
                                    moment(certification_request.date).format(
                                        "LL"
                                    )
                                }}
                            </td>
                            <td
                                v-if="
                                    permission == 'chairperson' ||
                                    permission == 'secretary'
                                "
                            >
                                {{ certification_request.purpose }}
                            </td>
                            <td>
                                {{ certification_request.status }}
                            </td>
                            <td
                                v-if="
                                    permission == 'resident' &&
                                    certification_request.status == 'Pending'
                                "
                            >
                                <button
                                    class="btn btn-primary"
                                    v-b-modal.modal-edit
                                    @click="setPosition(certification_request)"
                                >
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button
                                    class="btn btn-danger"
                                    v-b-modal.modal-delete
                                    @click="setPosition(certification_request)"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                            <td
                                v-if="
                                    (permission == 'chairperson' &&
                                        certification_request.status ==
                                            'Pending') ||
                                    (permission == 'secretary' &&
                                        certification_request.status ==
                                            'Pending')
                                "
                            >
                                <button
                                    class="btn btn-success"
                                    v-b-modal.modal-update
                                    @click="setPosition(certification_request)"
                                >
                                    <i class="fas fa-check"></i>
                                </button>
                                <button
                                    class="btn btn-danger"
                                    v-b-modal.modal-delete
                                    @click="setPosition(certification_request)"
                                >
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                            <td
                                v-if="
                                    certification_request.status == 'Approved'
                                "
                            >
                                <button
                                    class="btn btn-primary"
                                    v-b-modal.modal-view
                                    @click="setPosition(certification_request)"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button
                                    class="btn btn-success"
                                    @click="
                                        findGcashToGenerate(
                                            certification_request
                                        )
                                    "
                                    v-if="
                                        new Date(
                                            moment(
                                                certification_request.date
                                            ).format('LL')
                                        ).getTime() <=
                                            new Date(
                                                moment(today).format('LL')
                                            ) &&
                                        (permission == 'chairperson' ||
                                            permission == 'secretary')
                                    "
                                >
                                    <i class="fas fa-file"></i>
                                </button>
                            </td>
                            <td v-if="certification_request.status == 'Paid'">
                                <button
                                    class="btn btn-primary"
                                    v-b-modal.modal-payment-view
                                    @click="findGcash(certification_request)"
                                >
                                    <i class="fas fa-eye"></i>
                                </button>
                            </td>
                            <td
                                v-if="
                                    certification_request.status ==
                                    'Unpaid Certificates'
                                "
                            >
                                <button
                                    class="btn btn-primary"
                                    v-b-modal.modal-payment-view-without-btn
                                    @click="findGcash(certification_request)"
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
                        v-on:input="fetchCertificationRequest()"
                        style="align-items: flex-end"
                    ></b-pagination>
                </div>
            </div>

            <b-modal
                id="modal-payment-view"
                size="md"
                title="Payment Review"
                centered
                @ok.prevent="approvedCertificates()"
                @cancel.prevent="rejectCertificates()"
                @hidden="resetFields()"
                ok-title="Approve"
                cancel-title="Reject"
            >
                <div class="text-center">
                    <img
                        :src="'http://127.0.0.1:8000/evidence/' + this.evidence"
                        width="300"
                    />
                </div>
            </b-modal>

            <b-modal
                id="modal-payment-view-without-btn"
                size="md"
                title="Payment Review"
                centered
                @hidden="resetFields()"
                ok-title="Close"
                ok-only
            >
                <div class="text-center">
                    <img
                        :src="'http://127.0.0.1:8000/evidence/' + this.evidence"
                        width="300"
                    />
                </div>
            </b-modal>

            <b-modal
                id="modal-view"
                size="md"
                title="Set Schedule"
                ok-only
                centered
            >
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Date:
                    </label>
                    <input
                        type="text"
                        v-model="scheduledDate"
                        class="form-control"
                        disabled
                    />
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.date[0]
                        }}</label>
                    </div> -->
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Time:
                    </label>
                    <select
                        class="form-select"
                        id="inputGroupSelect01"
                        v-model="time"
                        disabled
                    >
                        <option :value="'8:00AM-12:00NN'">
                            8:00AM-12:00NN
                        </option>
                        <option :value="'1:00PM-5:00PM'">1:00PM-5:00PM</option>
                    </select>
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.time[0]
                        }}</label>
                    </div> -->
                </div>
            </b-modal>

            <b-modal
                id="modal-update"
                size="md"
                title="Set Schedule"
                centered
                @ok.prevent="approveRequest()"
                @hidden="resetFields()"
                ok-title="Approve"
                ok-only
            >
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Date:
                    </label>
                    <input type="date" v-model="date" class="form-control" />
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Time:
                    </label>
                    <select
                        class="form-select"
                        id="inputGroupSelect01"
                        v-model="scheduledTime"
                    >
                        <option :value="'8:00AM-12:00NN'">
                            8:00AM-12:00NN
                        </option>
                        <option :value="'1:00PM-5:00PM'">1:00PM-5:00PM</option>
                    </select>
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.time[0]
                        }}</label>
                    </div> -->
                </div>
            </b-modal>

            <b-modal
                id="modal-edit"
                size="md"
                title="Edit Request"
                centered
                @ok.prevent="updateCertificationRequest()"
                ok-only
                @hidden="resetFields()"
                ok-title="Update"
            >
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Type of Certification:
                    </label>
                    <select
                        class="form-select"
                        name="civil-status"
                        id="civil_status"
                        v-model="certification_id"
                    >
                        <option
                            v-for="certification in certifications"
                            :key="certification.id"
                            :value="certification.id"
                        >
                            {{ certification.certification_description }}
                        </option>
                    </select>
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Purpose:
                    </label>
                    <input
                        v-model="purpose"
                        type="text"
                        class="form-control"
                        name="certification_request"
                        id="certification_request"
                    />
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Expected Date:
                    </label>
                    <input
                        type="date"
                        v-model="expected_date"
                        class="form-control"
                    />
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.date[0]
                        }}</label>
                    </div> -->
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Expected Time:
                    </label>
                    <select
                        class="form-select"
                        id="inputGroupSelect01"
                        v-model="expected_time"
                    >
                        <option :value="'8:00AM-12:00NN'">
                            8:00AM-12:00NN
                        </option>
                        <option :value="'1:00PM-5:00PM'">1:00PM-5:00PM</option>
                    </select>
                </div>
            </b-modal>

            <b-modal
                id="modal-add"
                size="md"
                title="Request Certification"
                centered
                @ok.prevent="createCertificationRequest()"
                ok-only
                @hidden="resetFields()"
                ok-title="Request"
            >
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Type of Certification:
                    </label>
                    <select
                        class="form-select"
                        name="civil-status"
                        id="civil_status"
                        v-model="certification_id"
                    >
                        <option
                            v-for="certification in certifications"
                            :key="certification.id"
                            :value="certification.id"
                        >
                            {{ certification.certification_description }}
                        </option>
                    </select>
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
                </div>
                <div v-if="certification_id == 4">
                    <div class="form-group">
                        <label
                            for="certification_request"
                            class="control-label"
                        >
                            Business Name:
                        </label>
                        <input
                            v-model="business_name"
                            type="text"
                            class="form-control"
                            name="certification_request"
                            id="certification_request"
                        />
                    </div>
                    <div class="form-group">
                        <label
                            for="certification_request"
                            class="control-label"
                        >
                            Business Owner:
                        </label>
                        <input
                            v-model="business_owner"
                            type="text"
                            class="form-control"
                            name="certification_request"
                            id="certification_request"
                        />
                    </div>
                    <div class="form-group">
                        <label
                            for="certification_request"
                            class="control-label"
                        >
                            Business Nature:
                        </label>
                        <input
                            v-model="business_nature"
                            type="text"
                            class="form-control"
                            name="certification_request"
                            id="certification_request"
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Purpose:
                    </label>
                    <input
                        v-model="purpose"
                        type="text"
                        class="form-control"
                        name="certification_request"
                        id="certification_request"
                    />
                    <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Expected Date:
                    </label>
                    <input
                        type="date"
                        v-model="expected_date"
                        class="form-control"
                    />
                    <div v-if="errors.expected_date">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.expected_date
                        }}</label>
                    </div>
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Expected Time:
                    </label>
                    <select
                        class="form-select"
                        id="inputGroupSelect01"
                        v-model="expected_time"
                    >
                        <option :value="'8:00AM-12:00NN'">
                            8:00AM-12:00NN
                        </option>
                        <option :value="'1:00PM-5:00PM'">1:00PM-5:00PM</option>
                    </select>
                    <div v-if="errors.expected_time">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.expected_time
                        }}</label>
                    </div>
                </div>
            </b-modal>

            <b-modal
                id="modal-payment"
                size="md"
                title="Certification Payment"
                centered
                @ok.prevent="generateCertificate()"
                ok-only
                @hidden="resetFields()"
                ok-title="Generate"
            >
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Amount:
                    </label>
                    <input
                        type="number"
                        v-model="amount"
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Payment Details:
                    </label>
                    <input
                        type="text"
                        v-model="payment_detail"
                        class="form-control"
                        disabled
                    />
                </div>
            </b-modal>

            <b-modal
                id="modal-delete"
                size="md"
                title="Reject Request"
                centered
                @hidden="resetFields()"
                @ok.prevent="deletePosition()"
                ok-title="Delete"
            >
                Are you sure you want to delete this request?
            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import moment from "moment";
export default {
    data() {
        return {
            id: null,
            resident_id: localStorage.getItem("resident_id"),
            certification_id: null,
            purpose: null,
            status: null,
            time: null,
            date: null,
            expected_time: null,
            expected_date: null,
            certification_requests: [],
            certifications: [],
            errors: [],

            business_name: null,
            business_owner: null,
            business_nature: null,

            payment_id: "",
            evidence: "",

            scheduledDate: null,
            scheduledTime: null,

            amount: null,
            payment_detail: null,

            search_status: "Pending",
            // search: "",
            today: moment(new Date()).format("LL"),

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),

            moment: moment,
        };
    },

    computed: {
        filterStatus() {
            return this.certification_requests.filter((data) => {
                return data.status.includes(this.search_status);
            });
        },
    },

    methods: {
        async fetchFindResidentCertificationRequest() {
            this.loading = true;
            await axios
                .post(
                    `/find-resident-certificate?page=${this.currentPage}`,
                    this.resident_id
                )
                .then((response) => {
                    this.certification_requests = response.data.data;
                    this.time = this.certification_requests.time;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchCertificationRequest() {
            this.loading = true;
            await axios
                .get(`/certification_request?page=${this.currentPage}`)
                .then((response) => {
                    this.certification_requests = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                    console.log(
                        new Date(
                            moment(this.certification_requests[0].date).format(
                                "LL"
                            )
                        ).getTime() <= new Date(this.today).getTime()
                    );
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchCertification() {
            this.loading = true;
            await axios
                .get(`/certification?page=${this.currentPage}`)
                .then((response) => {
                    this.certifications = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        isToday(date) {
            const today = new Date();
            if (today.toDateString() === date.toDateString()) {
                return true;
            }
            return false;
        },
        async createCertificationRequest() {
            if (
                new Date() > new Date(moment(this.expected_date).format("L")) &&
                !this.isToday(new Date(this.expected_date))
            ) {
                this.errors = {
                    expected_date: "Expected date must be today or ahead.",
                };
            } else {
                const data = {
                    resident_id: this.resident_id,
                    certification_id: this.certification_id,
                    purpose: this.purpose,
                    expected_time: this.expected_time,
                    expected_date: this.expected_date,
                    status: "Pending",
                };

                await axios
                    .post("/certification_request", data)
                    .then((response) => {
                        console.log(response.data);
                        if (this.certification_id == 4) {
                            var data2 = {
                                business_name: this.business_name,
                                business_owner: this.business_owner,
                                business_nature: this.business_nature,
                                certification_request_id: response.data.id,
                            };

                            axios.post("/business_permit", data2);
                        }
                        this.$toast.success(
                            "Certification Request has been created."
                        );
                        this.fetchCertificationRequest();
                        this.resetFields();
                        this.$bvModal.hide("modal-add");
                    })
                    .catch((error) => {
                        this.errors = error.response.data.errors;
                    });
            }
        },

        setPosition(data) {
            this.id = data.id;
            this.resident_id = data.resident_id;
            this.certification_id = data.certification_id;
            this.purpose = data.purpose;
            this.status = data.status;
            this.date = data.expected_date;
            this.time = data.time;
            this.payment_date = moment(new Date()).format("LL");
            this.payment_detail = data.certification.certification_description;
            this.scheduledDate = moment(data.date).format("LL");
            this.scheduledTime = data.expected_time;
            this.expected_date = data.expected_date;
            this.expected_time = data.expected_time;
        },

        async findGcash(data) {
            const datas = {
                search: data.id,
            };
            await axios.post(`/search-gcash`, datas).then((response) => {
                this.evidence = response.data[0].evidence;
                this.payment_id = response.data[0].certification_request_id;
                this.payment_detail =
                    data.certification.certification_description;
                this.amount = data.certification.price;
                this.payment_date = moment(new Date()).format("LL");
                this.resident_id = data.resident_id;
            });
        },

        async findGcashToGenerate(data) {
            this.id = data.id;
            this.resident_id = data.resident_id;
            this.certification_id = data.certification_id;
            this.purpose = data.purpose;
            this.status = data.status;
            this.date = data.expected_date;
            this.time = data.expected_time;
            this.payment_date = moment(new Date()).format("LL");
            this.payment_detail = data.certification.certification_description;
            this.scheduledDate = moment(data.date).format("LL");
            this.scheduledTime = data.expected_time;
            this.expected_date = data.expected_date;
            this.expected_time = data.expected_time;
            const datas = {
                search: data.id,
            };
            await axios.post(`/search-gcash`, datas).then((response) => {
                if (response.data.length != 0) {
                    if (
                        response.data[0].certification_request
                            .certification_id == 1
                    ) {
                        this.$router.push({
                            path: `/certificate/barangay_certificates/${response.data[0].certification_request.id}`,
                        });
                    } else if (
                        response.data[0].certification_request
                            .certification_id == 2
                    ) {
                        this.$router.push({
                            path: `/certificate/barangay_clearance/${response.data[0].certification_request.id}`,
                        });
                    } else if (
                        response.data[0].certification_request
                            .certification_id == 4
                    ) {
                        this.$router.push({
                            path: `/certificate/Business_Clearance/${response.data[0].certification_request.id}`,
                        });
                    }
                } else if (this.certification_id == 3) {
                    this.$router.push({
                        path: `/certificate/indigency/${this.id}`,
                    });
                } else {
                    this.$bvModal.show("modal-payment");
                }
            });
        },

        async approveRequest() {
            if (this.scheduledTime == null || this.date == null) {
                this.$toast.error("Please fill out all fields.");
            }
            if (
                new Date().getTime() >=
                    new Date(moment(this.date).format("L")).getTime() &&
                !this.isToday(new Date(this.date))
            ) {
                this.$toast.error("Invalid date.");
            } else {
                var data = {};

                if (this.certification_id == 3) {
                    data = {
                        id: this.id,
                        resident_id: this.resident_id,
                        certification_id: this.certification_id,
                        purpose: this.purpose,
                        status: "Approved",
                        time: this.scheduledTime,
                        date: this.date,
                    };
                } else {
                    data = {
                        id: this.id,
                        resident_id: this.resident_id,
                        certification_id: this.certification_id,
                        purpose: this.purpose,
                        status: "Unpaid Certificates",
                        time: this.scheduledTime,
                        date: this.date,
                    };
                }

                await axios
                    .put(`/certification_request/${data.id}`, data)
                    .then((response) => {
                        if (
                            this.permission == "chairperson" ||
                            this.permission == "secretary"
                        ) {
                            this.$toast.success(
                                "Certification Request has been updated."
                            );
                            this.fetchCertificationRequest();
                            this.resetFields();
                        } else if (this.permission == "resident") {
                            this.$toast.success(
                                "Certification Request has been updated."
                            );
                            this.fetchFindResidentCertificationRequest();
                            this.resetFields();
                        }

                        this.$bvModal.hide("modal-update");
                        return response;
                    });
            }
        },

        async approvedCertificates() {
            const data = {
                id: this.payment_id,
                status: "Approved",
                details: this.payment_detail,
                amount: this.amount,
                resident_id: this.resident_id,

                date: new Date(
                    new Date(this.payment_date).getTime() -
                        new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .split("T")[0],
            };

            await axios
                .post(`/certification-request`, data)
                .then((response) => {
                    if (
                        this.permission == "chairperson" ||
                        this.permission == "secretary"
                    ) {
                        this.$toast.success(
                            "Certification Request has been updated."
                        );
                        this.fetchCertificationRequest();
                        this.resetFields();
                    }

                    this.$bvModal.hide("modal-payment-view");
                    return response;
                });
        },

        async rejectCertificates() {
            const data = {
                id: this.payment_id,
                status: "Unpaid Certificates",
            };

            await axios
                .put(`/certification_request/${data.id}`, data)
                .then((response) => {
                    if (
                        this.permission == "chairperson" ||
                        this.permission == "secretary"
                    ) {
                        this.$toast.success(
                            "Certification Request has been updated."
                        );
                        this.fetchCertificationRequest();
                        this.resetFields();
                    }

                    this.$bvModal.hide("modal-payment-view");
                    return response;
                });
        },

        async updateCertificationRequest() {
            const data = {
                id: this.id,
                resident_id: this.resident_id,
                certification_id: this.certification_id,
                purpose: this.purpose,
                expected_time: this.expected_time,
                expected_date: this.expected_date,
                status: this.status,
            };

            await axios
                .put(`/certification_request/${data.id}`, data)
                .then((response) => {
                    if (
                        this.permission == "chairperson" ||
                        this.permission == "secretary"
                    ) {
                        this.$toast.success(
                            "Certification Request has been updated."
                        );
                        this.fetchCertificationRequest();
                        this.resetFields();
                    } else if (this.permission == "resident") {
                        this.$toast.success(
                            "Certification Request has been updated."
                        );
                        this.fetchFindResidentCertificationRequest();
                        this.resetFields();
                    }

                    this.$bvModal.hide("modal-edit");
                    return response;
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deletePosition() {
            const data = {
                id: this.id,
                resident_id: this.resident_id,
                certification_id: this.certification_id,
                purpose: this.purpose,
                status: "Rejected",
            };

            await axios
                .put(`/certification_request/${data.id}`, data)
                .then((response) => {
                    if (
                        this.permission == "chairperson" ||
                        this.permission == "secretary"
                    ) {
                        this.$toast.success(
                            "Certification Request has been rejected."
                        );
                        this.fetchCertificationRequest();
                        this.resetFields();
                    } else if (this.permission == "resident") {
                        this.$toast.success(
                            "Certification Request has been updated."
                        );
                        this.fetchFindResidentCertificationRequest();
                        this.resetFields();
                    }

                    this.$bvModal.hide("modal-delete");
                    return response;
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async generateCertificate() {
            var data = {
                resident_id: this.resident_id,
                amount: this.amount,
                details: this.payment_detail,
                mode_of_payment: "Via Barangay Hall",
                date: new Date(
                    new Date().getTime() -
                        new Date().getTimezoneOffset() * 60000
                )
                    .toISOString()
                    .split("T")[0],
            };

            await axios.post("/revenue", data).then(() => {
                this.$toast.success(
                    "Certification payment has been successful."
                );
                this.fetchCertificationRequest();

                if (this.payment_detail == "Barangay Certificate") {
                    this.$router.push({
                        path: `/certificate/barangay_certificates/${this.id}`,
                    });
                } else if (this.payment_detail == "Barangay Clearance") {
                    this.$router.push({
                        path: `/certificate/barangay_clearance/${this.id}`,
                    });
                } else if (this.payment_detail == "Certificate of Indigency") {
                    this.$router.push({
                        path: `/certificate/indigency/${this.id}`,
                    });
                } else if (this.payment_detail == "Business Permit") {
                    this.$router.push({
                        path: `/certificate/Business_Clearance/${this.id}`,
                    });
                }
            });
        },

        async resetFields() {
            this.certification_id = null;
            this.purpose = null;
            this.errors = [];
            this.amount = null;
            this.payment_detail = null;
            this.expected_date = null;
            this.expected_time = null;
            this.payment_id = null;
            this.evidence = null;
        },
    },

    mounted() {
        if (
            this.permission == "chairperson" ||
            this.permission == "secretary"
        ) {
            this.fetchCertificationRequest();
            this.fetchCertification();
        } else if (this.permission == "resident") {
            this.fetchFindResidentCertificationRequest();
            this.fetchCertification();
        }
    },
};
</script>