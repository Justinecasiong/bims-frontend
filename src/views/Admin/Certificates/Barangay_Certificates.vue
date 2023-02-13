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
            <div class="header">
                <h5>Republic of the Philippines</h5>
                <h5>Province of LEYTE</h5>
                <h5>TACLOBAN CITY</h5>
                <h3 style="font-weight: bold">
                    STO. NIÑO EXTENSION, BARANGAY 6-A
                </h3>
                <h6 style="font-style: italic">Mobile No. (053) 300 - 2436</h6>
            </div>

            <div class="container">
                <div class="row">
                    <div class="col-lg-3 officials">
                        <div class="container-box">
                            <img
                                class="profile-image"
                                :src="
                                    require('../../../assets/images/brgylogo.jpg')
                                "
                                width="200"
                            />
                            <br /><br />
                            <h5 style="font-weight: bold">
                                {{ this.chairman[0].fullname.toUpperCase() }}
                            </h5>
                            <h6>
                                {{
                                    this.chairman[0].position
                                        .position_description
                                }}
                            </h6>
                            <br />
                            <li
                                v-for="kagawad in kagawads"
                                :key="kagawad.id"
                                style="list-style-type: none"
                            >
                                <h5 style="font-weight: bold">
                                    {{ kagawad.fullname.toUpperCase() }}
                                </h5>
                                <h6>
                                    {{ kagawad.position.position_description }}
                                </h6>
                                <br />
                            </li>
                            <li
                                v-for="sk_chairman in sk_chairmans"
                                :key="sk_chairman.id"
                                style="list-style-type: none"
                            >
                                <h5 style="font-weight: bold">
                                    {{ sk_chairman.fullname.toUpperCase() }}
                                </h5>
                                <h6>
                                    {{
                                        sk_chairman.position
                                            .position_description
                                    }}
                                </h6>
                                <br />
                            </li>
                        </div>

                        <br /><br />
                        <h5 style="font-weight: bold">
                            {{ this.secretary[0].fullname.toUpperCase() }}
                        </h5>
                        <h6>
                            {{
                                this.secretary[0].position.position_description
                            }}
                        </h6>
                    </div>
                    <div class="col contents">
                        <div class="header">
                            <h4>OFFICE OF THE BARANGAY CAPTAIN</h4>
                            <br />
                            <h3 style="font-weight: bold">
                                BARANGAY CERTIFICATION
                            </h3>
                        </div>
                        <br /><br />
                        <h4>TO WHOM IT MAY CONCERN:</h4>
                        <br />
                        <h4>
                            &nbsp;&nbsp; &nbsp; &nbsp; This is to certify that
                            <b>
                                {{ this.residents.first_name.toUpperCase() }}
                                {{ this.residents.middle_name.charAt(0) }}.
                                {{ this.residents.last_name.toUpperCase() }} </b
                            >, is a permanent resident of
                            <b>{{ this.residents.address.toUpperCase() }}</b
                            >. and that he/she is known to me to be of good
                            moral character.
                        </h4>
                        <br />
                        <h4>
                            &nbsp;&nbsp; &nbsp; &nbsp; This
                            certification/clearance is hereby issued to the
                            above-named person for whatever legal purpose it may
                            serve him/her best.
                        </h4>
                        <br />
                        <h4>
                            Given this <b>{{ date.toUpperCase() }}</b
                            >.
                        </h4>
                        <br /><br /><br /><br /><br />
                        <h4>NOT VALID WITHOUT SEAL:</h4>

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
                            <div class="col-lg-8"></div>
                            <div class="col-lg-4 mb-5"></div>
                        </div>
                        <div class="tax-payer">
                            <h4 style="font-weight: bold">
                                {{ this.residents.first_name.toUpperCase() }}
                                {{ this.residents.middle_name.charAt(0) }}.
                                {{ this.residents.last_name.toUpperCase() }}
                            </h4>
                            <h5>Resident’s Signature</h5>
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
            residents: [],
            currentPage: 1,
        };
    },

    computed: {
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

        sk_chairmans() {
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
                    console.log(response.data.data);
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchCertificationRequest() {
            this.loading = true;
            await axios
                .get(`/certification_request?search=${this.id}`)
                .then((response) => {
                    console.log(response.data.data[0].resident);
                    this.residents = response.data.data[0].resident;
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
                        this.fetchCertificationRequest();
                        this.resetFields();
                    }
                    this.$bvModal.hide("modal-payment-view");
                    return response;
                });
        },
    },

    async mounted() {
        this.fetchOfficial();
        this.fetchCertificationRequest();
    },
};
</script>