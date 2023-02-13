<template>
    <div>
        <div style="text-align: right; margin-bottom: 20px">
            <button
                class="btn btn-primary"
                v-print="'#certificate'"
                @click="completeRequest()"
            >
                PRINT <i class="fas fa-print"></i>
            </button>
        </div>

        <div class="certificate" id="certificate">
            <div class="row">
                <div class="col-lg-3 left-logo">
                    <img
                        class="logo"
                        :src="require('../../../assets/images/brgylogo.jpg')"
                        width="120"
                    />
                </div>
                <div class="col-lg-6 header-top">
                    <h5 style="font-size: 16pt">Republic of the Philippines</h5>
                    <h5 style="font-size: 16pt">Province of LEYTE</h5>
                    <h5 style="font-size: 16pt">TACLOBAN CITY</h5>
                    <h3 style="font-weight: bold; font-size: 16pt">
                        STO. NIÑO EXTENSION, BARANGAY 6-A
                    </h3>
                    <h6 style="font-style: italic; font-size: 16pt">
                        Mobile No. (053) 300 - 2436
                    </h6>
                </div>
                <div class="col-lg-3 right-logo">
                    <img
                        class="logo"
                        :src="require('../../../assets/images/taclogo.png')"
                        width="110"
                    />
                </div>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col contents">
                        <div class="header">
                            <h4>OFFICE OF THE BARANGAY CAPTAIN</h4>
                            <br />
                            <h1
                                style="
                                    font-weight: bold;
                                    text-decoration: underline;
                                "
                            >
                                BARANGAY BUSINESS CLEARANCE
                            </h1>
                        </div>
                        <br /><br />
                        <h4>GRANTED TO:</h4>
                        <br />
                        <div class="text-center pt-4">
                            <h3
                                class="w-50"
                                style="
                                    border-bottom: 2px solid black;
                                    margin: auto;
                                "
                            >
                                {{ business_permit[0].business_owner }}
                            </h3>
                            <h4>BUSINESS OWNER</h4>
                        </div>
                        <div class="text-center pt-4 mb-5">
                            <h3
                                class="w-50"
                                style="
                                    border-bottom: 2px solid black;
                                    margin: auto;
                                "
                            >
                                {{ business_permit[0].business_name }}
                            </h3>

                            <h4>NAME OF BUSINESS OR ESTABLISHMENT</h4>
                        </div>
                        <h4>
                            &nbsp;&nbsp; &nbsp; &nbsp; This clearance is granted
                            in accordance with section 152 of R.A. 7160 of
                            Barangay Tax Ordinance, provided however, that the
                            necessary fees are paid to the Barangay Treasurer.
                        </h4>
                        <br />
                        <h4>
                            &nbsp;&nbsp; &nbsp; &nbsp; This is non-transferable
                            and shall be deemed null and void upon failure by
                            the owner to follow the said rules and regulations
                            set forth by the Local Government Unit of TACLOBAN
                            CITY.
                        </h4>
                        <br />
                        <h4>
                            Given this <b>{{ date.toUpperCase() }}</b> at the
                            Office of the Punong Barangay,
                            <b>STO. NIÑO EXTENSION, BARANGAY 6-A</b>,
                            Philippines
                        </h4>

                        <div class="signee">
                            <div class="row">
                                <div class="col-lg-7"></div>

                                <div class="col-lg-5">
                                    <div class="chairperson">
                                        <h4 style="font-weight: bold">
                                            {{
                                                this.chairman[0].fullname.toUpperCase()
                                            }}
                                        </h4>
                                        <h5>
                                            {{
                                                this.chairman[0].position
                                                    .position_description
                                            }}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="footer">
                        <div class="row">
                            <h6>CTC No.:</h6>
                        </div>
                        <div class="row">
                            <h6>Issued On.:</h6>
                        </div>
                        <div class="row">
                            <h6>
                                Isuued at.: STO. NIÑO EXTENSION, BARANGAY
                                6-A,TACLOBAN CITY
                            </h6>
                        </div>
                        <div class="row">
                            <h6>OR No.:</h6>
                        </div>
                        <div class="row mt-3">
                            <h6>
                                (This permit, while in force, shall be posted in
                                a conspicious place in the business premises.)
                            </h6>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import axios from "../../../axios";
import Print from "vue-print-nb";
export default {
    props: ["id"],

    directives: {
        Print,
    },

    data() {
        return {
            date: moment(new Date()).format("LL"),
            search: "",

            officials: [],
            business_permit: [],
            currentPage: 1,
        };
    },

    computed: {
        residents() {
            return this.$store.getters["RESIDENT/GET_RESIDENT"];
        },

        chairman() {
            return this.officials.filter((data) => {
                return data.position.position_description.match("Chairperson");
            });
        },

        kagawads() {
            return this.officials.filter((data) => {
                return data.position.position_description.match("Kagawad");
            });
        },

        secretary() {
            return this.officials.filter((data) => {
                return data.position.position_description.match("Secretary");
            });
        },

        sk_chairman() {
            return this.officials.filter((data) => {
                return data.position.position_description.match("SK Chairman");
            });
        },
    },

    methods: {
        async fetchOfficial() {
            this.loading = true;
            await axios
                .get(`/barangay_officals?page=${this.currentPage}`)
                .then((response) => {
                    this.officials = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchBusinessPermit() {
            this.loading = true;
            await axios
                .get(`/business_permit?search=${this.id}`)
                .then((response) => {
                    this.business_permit = response.data;
                });
            this.loading = false;
        },

        async completeRequest() {
            const data = {
                id: this.id,
                status: "Printed",
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
                    }
                    this.$bvModal.hide("modal-payment-view");
                    return response;
                });
        },
    },

    async mounted() {
        await this.$store.dispatch("RESIDENT/FETCH_RESIDENT_BY_ID", this.id);
        this.fetchOfficial();
        this.fetchBusinessPermit();
    },
};
</script>