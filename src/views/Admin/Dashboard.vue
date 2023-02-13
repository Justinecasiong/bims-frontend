<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-10">
                    <h1>Dashboard</h1>
                </div>
                <div
                    class="col"
                    v-if="permission == 'chairperson' || permission == 'admin'"
                >
                    <router-link :to="{ name: 'Analytics' }">
                        <button class="btn btn-primary">View Analytics</button>
                    </router-link>
                </div>
            </div>
        </div>

        <div class="container">
            <div
                v-if="
                    certification_requests.length != 0 &&
                    permission == 'resident'
                "
                class="card shadow-lg"
            >
                <div
                    v-for="certification in certification_requests"
                    :key="certification.id"
                >
                    <div
                        class="row mb-4"
                        v-if="certification.status == 'Pending'"
                    >
                        <h4 style="font-weight: lighter">
                            Your request for
                            {{
                                certification.certification
                                    .certification_description
                            }}
                            is now pending for approval.
                        </h4>
                    </div>
                    <div
                        class="row mb-4"
                        v-if="certification.status == 'Approved'"
                    >
                        <h4 style="font-weight: lighter">
                            <span>
                                Your request for
                                {{
                                    certification.certification
                                        .certification_description
                                }}
                                has been approved! You may get your
                                {{
                                    certification.certification
                                        .certification_description
                                }}
                                on
                                {{ moment(certification.date).format("LL") }}
                                at {{ certification.time }}.
                            </span>
                        </h4>
                    </div>
                    <div
                        class="row mb-4"
                        v-if="certification.status == 'Unpaid Certificates'"
                    >
                        <h4 style="font-weight: lighter">
                            <span>
                                Your request for
                                {{
                                    certification.certification
                                        .certification_description
                                }}
                                has been processed. Please choose a mode of
                                payment.
                            </span>
                        </h4>
                    </div>
                    <div class="row mb-4" v-if="certification.status == 'Paid'">
                        <h4 style="font-weight: lighter">
                            <span>
                                Your payment for
                                {{
                                    certification.certification
                                        .certification_description
                                }}
                                is being validated. Please wait for the
                                confirmation for your request.
                            </span>
                        </h4>
                    </div>
                    <div
                        class="row mb-4"
                        v-if="
                            certification.certification
                                .certification_description !=
                                'Certificate of Indigency' &&
                            certification.status == 'Unpaid Certificates'
                        "
                    >
                        <h4 style="font-weight: lighter">
                            <span style="font-style: italic">
                                <br />
                                Click
                                <span
                                    style="
                                        color: blue;
                                        text-decoration: underline;
                                        cursor: pointer;
                                    "
                                    @click="setCertificationID(certification)"
                                    v-b-modal.modal-payment
                                >
                                    here</span
                                >
                                to choose mode of payment. (required)
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-7 card shadow text-center">
                    <div class="card-header">
                        <div class="card-title fw-bold">
                            Covid-19 Status Chart
                        </div>
                    </div>
                    <GChart
                        type="ColumnChart"
                        :data="covidData"
                        :options="covidOptions"
                        :events="chartEvents"
                        ref="gChart"
                    />
                </div>
                <div class="col card shadow text-center">
                    <div class="card-header">
                        <div class="card-title fw-bold">Population</div>
                    </div>
                    <GChart
                        type="PieChart"
                        :data="populationData"
                        :options="populationOptions"
                    />
                    <div class="card-footer" style="font-size: 20px">
                        Total Population: {{ totalPopulation }}
                    </div>
                </div>
            </div>
            <div
                class="row card shadow-lg text-center"
                v-if="permission != 'resident'"
            >
                <div class="card-header">
                    <div class="row">
                        <div class="col-10">
                            <div class="card-title fw-bold">Revenue Chart</div>
                        </div>
                        <div class="col">
                            <select
                                class="form-select"
                                id="inputGroupSelect01"
                                v-model="type_of_chart"
                            >
                                <option :value="'Annual Report'">
                                    Annual Report
                                </option>
                                <option :value="'Monthly Report'">
                                    Monthly Report
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-if="type_of_chart == 'Annual Report'">
                    <GChart
                        type="ColumnChart"
                        :data="revenueDataByYear"
                        :options="revenueOptions"
                    />
                </div>
                <div v-if="type_of_chart == 'Monthly Report'">
                    <GChart
                        type="ColumnChart"
                        :data="revenueDataByMonth"
                        :options="revenueOptions"
                    />
                </div>
            </div>
            <div class="row card">
                <h6>
                    > Barangay 6-A is one of the Barangays of Tacloban City. >
                    Tacloban City is in the Province of Leyte > The province of
                    Leyte is in Region 8 – Eastern Visayas Region
                </h6>
                <img :src="require('../../assets/images/brgy.jpg')" />
            </div>
        </div>
        <div v-if="permission == 'resident'">
            <b-modal
                id="modal-payment"
                size="md"
                title="Choose Mode of Payment"
                centered
                hide-footer
            >
                <div class="row">
                    <div class="col text-center">
                        <button
                            type="button"
                            class="btn btn-primary btn-lg"
                            v-b-modal.modal-gcash
                        >
                            GCASH QR CODE
                        </button>
                    </div>
                    <div class="col text-center">
                        <button
                            type="button"
                            class="btn btn-warning btn-lg"
                            @click="viaBarangayHall()"
                        >
                            Via Barangay Hall
                        </button>
                    </div>
                </div>
            </b-modal>
            <b-modal
                id="modal-gcash"
                size="md"
                title="GCASH Payment"
                centered
                @ok.prevent="createGcash()"
                @hidden="resetFields()"
            >
                <div class="row">
                    <div class="text-center mb-3">
                        <img
                            :src="
                                'http://127.0.0.1:8000/qr_code/' +
                                this.gcash[0].image
                            "
                            width="300"
                        />
                        <h5 style="font-style: italic">
                            {{ finTreasurer[0].fullname }}
                        </h5>
                        <h5>{{ certification }} - {{ price }}</h5>
                    </div>
                    <div class="form-group text-center">
                        <label class="control-label"
                            >Attach proof of payment:</label
                        >
                        <input
                            class="form-control"
                            v-on:change="onProfilePicChange($event)"
                            type="file"
                            id="imageFile"
                            accept="image/*"
                        />
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import { GChart } from "vue-google-charts/legacy";
import moment from "moment";
export default {
    components: {
        GChart,
    },
    data() {
        return {
            covids: {},
            residents: {},
            revenues: {},
            certifications: {},
            certification_requests: {},
            officials: {},
            gcash: {},
            find_gcash: {},

            search: "",
            search_gcash: "",
            certification: null,
            price: null,
            proof_pic: null,

            loading: false,
            moment: moment,

            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),
            resident_id: localStorage.getItem("resident_id"),

            unvaccinated: 0,
            firstPfizer: 0,
            firstModerna: 0,
            firstAstrazeneca: 0,
            firstJohnson: 0,
            firstSinovac: 0,

            secondPfizer: 0,
            secondModerna: 0,
            secondAstrazeneca: 0,
            secondJohnson: 0,
            secondSinovac: 0,

            boosterPfizer: 0,
            boosterModerna: 0,
            boosterAstrazeneca: 0,
            boosterJohnson: 0,
            boosterSinovac: 0,

            type_of_chart: "Annual Report",

            male: 0,
            female: 0,
            lgbtq: 0,
            pwd: 0,
            senior: 0,
            dominant: 0,
            dominantAge: 0,

            totalPopulation: 0,

            covidData: [],
            covidOptions: {
                vAxis: {
                    format: "percent",
                },
                legend: { position: "top", maxLines: 3 },
                bar: { groupWidth: "75%" },
                isStacked: true,
                height: 400,
                series: {
                    0: { color: "#97B495" },
                    1: { color: "#E7BDD1" },
                    2: { color: "#F1BDA7" },
                    3: { color: "#FDDFD7" },
                    4: { color: "#B74545" },
                    5: { color: "#87BACD" },
                },
            },
            chartEvents: {
                select: () => {
                    const table = this.$refs.gChart.chartObject;
                    const selection = table.getSelection();
                    if (
                        selection[0].column == 1 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Unvaccinated"}`,
                        });
                    } else if (
                        selection[0].column == 2 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Pfizer"}`,
                        });
                    } else if (
                        selection[0].column == 3 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Moderna"}`,
                        });
                    } else if (
                        selection[0].column == 4 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Astrazeneca"}`,
                        });
                    } else if (
                        selection[0].column == 5 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Johnson & Johnson"}`,
                        });
                    } else if (
                        selection[0].column == 6 &&
                        this.permission != "resident"
                    ) {
                        this.$router.push({
                            path: `/covid/${"Sinovac"}`,
                        });
                    }
                },
            },

            populationData: [],
            populationOptions: {
                pieHole: 0.4,
                height: 350,
                legend: { position: "top", maxLines: 3 },
                colors: [
                    "#97B495",
                    "#87BACD",
                    "#F1BDA7",
                    "#E7BDD1",
                    "#B74545",
                    "#FDDFD7",
                ],
            },

            revenueDataByYear: [],
            revenueDataByMonth: [],
            revenueOptions: {
                legend: { position: "top", maxLines: 3 },
                bar: { groupWidth: "75%" },
                // height: 400,
                series: {
                    0: { color: "#87BACD" },
                    1: { color: "#E7BDD1" },
                    2: { color: "#FDDFD7" },
                },
            },
        };
    },

    computed: {
        filterUnvaccinated() {
            return this.covids.filter((data) => {
                return data.vaccination_type.match("Unvaccinated");
            });
        },

        finTreasurer() {
            return this.officials.filter((data) => {
                return data.position_id.toString().match("3");
            });
        },
    },

    methods: {
        async fetchFindResidentCertificationRequest() {
            this.loading = true;
            var data = {
                resident_id: this.resident_id,
            };
            await axios
                .post(
                    `/find-resident-certificate?page=${this.currentPage}`,
                    data
                )
                .then((response) => {
                    this.certification_requests = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
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

        async fetchCovid() {
            await axios
                .get(`/covid`)
                .then((response) => {
                    this.covids = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
        },

        async fetchRevenue() {
            var data = {
                year: new Date().getFullYear(),
            };
            this.loading = true;
            await axios.post(`/total-revenue-year`, data).then((response) => {
                this.revenues = response.data;

                this.revenueDataByYear.push(
                    [
                        "Year",
                        "Barangay Clearance",
                        "Residency Certificate",
                        "Business Permit",
                    ],
                    [
                        "2022",
                        response.data.barangay_clearance,
                        response.data.barangay_certificate,
                        response.data.business_certificate,
                    ]
                );
            });

            await axios.get(`/total-revenue-month`).then((response) => {
                this.revenues = response.data;

                this.revenueDataByMonth.push(
                    [
                        "Month",
                        "Barangay Clearance",
                        "Residency Certificate",
                        "Business Permit",
                    ],
                    [
                        "January",
                        response.data.revenue[0].barangay_clearance,
                        response.data.revenue[0].barangay_certificate,
                        response.data.revenue[0].business_certificate,
                    ],
                    [
                        "Febuary",
                        response.data.revenue[1].barangay_clearance,
                        response.data.revenue[1].barangay_certificate,
                        response.data.revenue[1].business_certificate,
                    ],
                    [
                        "March",
                        response.data.revenue[2].barangay_clearance,
                        response.data.revenue[2].barangay_certificate,
                        response.data.revenue[2].business_certificate,
                    ],
                    [
                        "April",
                        response.data.revenue[3].barangay_clearance,
                        response.data.revenue[3].barangay_certificate,
                        response.data.revenue[3].business_certificate,
                    ],
                    [
                        "May",
                        response.data.revenue[4].barangay_clearance,
                        response.data.revenue[4].barangay_certificate,
                        response.data.revenue[4].business_certificate,
                    ],
                    [
                        "June",
                        response.data.revenue[5].barangay_clearance,
                        response.data.revenue[5].barangay_certificate,
                        response.data.revenue[5].business_certificate,
                    ],
                    [
                        "July",
                        response.data.revenue[6].barangay_clearance,
                        response.data.revenue[6].barangay_certificate,
                        response.data.revenue[6].business_certificate,
                    ],
                    [
                        "August",
                        response.data.revenue[7].barangay_clearance,
                        response.data.revenue[7].barangay_certificate,
                        response.data.revenue[7].business_certificate,
                    ],
                    [
                        "September",
                        response.data.revenue[8].barangay_clearance,
                        response.data.revenue[8].barangay_certificate,
                        response.data.revenue[8].business_certificate,
                    ],
                    [
                        "October",
                        response.data.revenue[9].barangay_clearance,
                        response.data.revenue[9].barangay_certificate,
                        response.data.revenue[9].business_certificate,
                    ],
                    [
                        "November",
                        response.data.revenue[10].barangay_clearance,
                        response.data.revenue[10].barangay_certificate,
                        response.data.revenue[10].business_certificate,
                    ],
                    [
                        "December",
                        response.data.revenue[11].barangay_clearance,
                        response.data.revenue[11].barangay_certificate,
                        response.data.revenue[11].business_certificate,
                    ]
                );
            });
            this.loading = false;
        },

        async fetchResident() {
            await axios
                .get(`/count-total-population`)
                .then((response) => {
                    this.totalPopulation = response.data;
                })
                .catch((error) => {
                    return error.response;
                });
        },

        async fetchOfficial() {
            this.loading = true;
            await axios
                .get(`/barangay_officals?page=${this.currentPage}`)
                .then((response) => {
                    this.officials = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async countCovid() {
            await axios.get(`/count-unvaccinated`).then((response) => {
                this.unvaccinated = response.data;
            });

            await axios.get(`/count-first-dose`).then((response) => {
                this.firstPfizer = response.data[0];
                this.firstModerna = response.data[1];
                this.firstAstrazeneca = response.data[2];
                this.firstJohnson = response.data[3];
                this.firstSinovac = response.data[4];
            });

            await axios.get(`/count-second-dose`).then((response) => {
                this.secondPfizer = response.data[0];
                this.secondModerna = response.data[1];
                this.secondAstrazeneca = response.data[2];
                this.secondJohnson = response.data[3];
                this.secondSinovac = response.data[4];
            });

            await axios.get(`/count-booster`).then((response) => {
                this.boosterPfizer = response.data[0];
                this.boosterModerna = response.data[1];
                this.boosterAstrazeneca = response.data[2];
                this.boosterJohnson = response.data[3];
                this.boosterSinovac = response.data[4];
            });

            this.covidData.push(
                [
                    "Genre",
                    "Unvaccinated",
                    "Pfizer",
                    "Moderna",
                    "Astrazeneca",
                    "Johnson & Johnson",
                    "Sinovac",
                ],
                [
                    "Unvaccinated",
                    { v: this.unvaccinated, f: this.unvaccinated * 100 + "%" },
                    { v: 0, f: "0%" },
                    { v: 0, f: "0%" },
                    { v: 0, f: "0%" },
                    { v: 0, f: "0%" },
                    { v: 0, f: "0%" },
                ],
                [
                    "First dose only",
                    { v: 0, f: "0%" },
                    { v: this.firstPfizer, f: this.firstPfizer * 100 + "%" },
                    { v: this.firstModerna, f: this.firstModerna * 100 + "%" },
                    {
                        v: this.firstAstrazeneca,
                        f: this.firstAstrazeneca * 100 + "%",
                    },
                    { v: this.firstJohnson, f: this.firstJohnson * 100 + "%" },
                    { v: this.firstSinovac, f: this.firstSinovac * 100 + "%" },
                ],
                [
                    "Fully Vaccinated",
                    { v: 0, f: "0%" },
                    { v: this.secondPfizer, f: this.secondPfizer * 100 + "%" },
                    {
                        v: this.secondModerna,
                        f: this.secondModerna * 100 + "%",
                    },
                    {
                        v: this.secondAstrazeneca,
                        f: this.secondAstrazeneca * 100 + "%",
                    },
                    {
                        v: this.secondJohnson,
                        f: this.secondJohnson * 100 + "%",
                    },
                    {
                        v: this.secondSinovac,
                        f: this.secondSinovac * 100 + "%",
                    },
                ],
                [
                    "Fully Vaccinated with booster",
                    { v: 0, f: "0%" },
                    {
                        v: this.boosterPfizer,
                        f: this.boosterPfizer * 100 + "%",
                    },
                    {
                        v: this.boosterModerna,
                        f: this.boosterModerna * 100 + "%",
                    },
                    {
                        v: this.boosterAstrazeneca,
                        f: this.boosterAstrazeneca * 100 + "%",
                    },
                    {
                        v: this.boosterJohnson,
                        f: this.boosterJohnson * 100 + "%",
                    },
                    {
                        v: this.boosterSinovac,
                        f: this.boosterSinovac * 100 + "%",
                    },
                ]
            );
        },

        async countPopulation() {
            await axios.get(`/count-population`).then((response) => {
                this.male = response.data[0];
                this.female = response.data[1];
                this.pwd = response.data[2];
                this.senior = response.data[3];
                this.dominant = response.data[4];
                this.dominantAge = response.data[5];
                this.lgbtq = response.data[6];
            });

            this.populationData.push(
                ["Task", "Hours per Day"],
                ["Male", this.male],
                ["Female", this.female],
                ["LGBTQ", this.lgbtq],
                ["PWD", this.pwd],
                ["Senior Citizen", this.senior],
                ["Dominant Age = " + this.dominantAge, this.dominant]
            );
        },

        onProfilePicChange(e) {
            if (e.target?.files[0]) {
                this.proof_pic = null;
                this.proof_pic = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.proof_pic);
                reader.onload = (e) => {
                    this.proof_pic = e.target.result;
                };
            }
        },

        async fetchGcash() {
            await axios
                .get(`/gcashQR`)
                .then((response) => {
                    this.gcash = response.data;
                })
                .catch((error) => {
                    return error.response;
                });
        },

        setCertificationID(data) {
            this.search = data.id;
            this.certification = data.certification.certification_description;
            this.price = data.certification.price;
        },

        async findGcash() {
            await axios
                .post(`/search-gcash`, this.search)
                .then((response) => {
                    this.find_gcash = response.data;
                })
                .catch((error) => {
                    return error.response;
                });
        },

        async createGcash() {
            const data = {
                certification_request_id: this.search,
                evidence: this.proof_pic,
            };
            if (this.proof_pic == null) {
                this.$toast.error("Please fill out all field.");
            } else {
                await axios.post(`/gcash`, data).then((response) => {
                    this.gcash = response.data;
                    this.$bvModal.hide("modal-gcash");
                    this.$bvModal.hide("modal-payment");
                });
                this.fetchFindResidentCertificationRequest();
            }
        },

        async viaBarangayHall() {
            const data = {
                id: this.search,
                status: "Approved",
            };

            await axios
                .put(`/certification_request/${data.id}`, data)
                .then((response) => {
                    this.$toast.success(
                        "Certification Request has been updated."
                    );
                    this.fetchFindResidentCertificationRequest();
                    this.resetFields();

                    this.$bvModal.hide("modal-payment");
                    return response;
                });
        },

        resetFields() {
            this.proof_pic = null;
        },
    },

    mounted() {
        this.fetchCovid();
        this.fetchResident();
        this.countCovid();
        this.countPopulation();
        this.fetchRevenue();

        if (this.permission == "resident") {
            this.fetchFindResidentCertificationRequest();
            this.fetchCertification();
            this.fetchOfficial();
            this.fetchGcash();
            this.findGcash();
        }
    },
};
</script>