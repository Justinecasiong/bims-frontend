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
            <div style="text-align: center" class="mt-5">
                <div class="row">
                    <div class="col-lg-3 left-logo">
                        <img
                            class="logo"
                            :src="
                                require('../../../assets/images/brgylogo.jpg')
                            "
                            width="120"
                        />
                    </div>
                    <div class="col-lg-6 header-top">
                        <h5 style="font-size: 16pt">
                            Republic of the Philippines
                        </h5>
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
                            <h4 style="font-size: 18pt">
                                OFFICE OF THE BARANGAY CAPTAIN
                            </h4>
                            <br />
                            <h1
                                style="
                                    font-weight: bold;
                                    text-decoration: underline;
                                "
                            >
                                BLOTTER REPORT
                            </h1>
                        </div>
                        <br /><br />
                        <div style="margin-left: 100px">
                            <div class="row mb-3">
                                <div class="col-6">
                                    <h3>
                                        <b>Complainant:</b>
                                        {{ this.blotters[0].complainant }}
                                    </h3>
                                </div>
                                <div class="col-6">
                                    <h3>
                                        <b>Respondent:</b>
                                        {{ this.blotters[0].respondent }}
                                    </h3>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-6">
                                    <h3>
                                        <b>Victim:</b>
                                        {{ this.blotters[0].victims }}
                                    </h3>
                                </div>
                                <div class="col-6">
                                    <h3>
                                        <b>Type:</b> {{ this.blotters[0].type }}
                                    </h3>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-6">
                                    <h3>
                                        <b>Location:</b>
                                        {{ this.blotters[0].location }}
                                    </h3>
                                </div>
                                <div class="col-6">
                                    <h3>
                                        <b>Date:</b>
                                        {{
                                            moment(
                                                this.blotters[0].date
                                            ).format("LL")
                                        }}
                                    </h3>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-6">
                                    <h3>
                                        <b>Time:</b> {{ this.blotters[0].time }}
                                    </h3>
                                </div>
                                <div class="col-6">
                                    <h3>
                                        <b>Status:</b>
                                        {{ this.blotters[0].blotter_status }}
                                    </h3>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-6">
                                    <h3>
                                        <b>Blotter Details:</b>
                                        {{ this.blotters[0].details }}
                                    </h3>
                                </div>
                            </div>
                        </div>

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

                    <div class="footer"></div>
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
            blotters: [],
            currentPage: 1,
            moment: moment,
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

        async fetchBlotter() {
            this.loading = true;
            await axios
                .get(
                    `/blotter-print?page=${this.currentPage}&search=${this.id}`
                )
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
    },

    async mounted() {
        this.fetchOfficial();
        this.fetchBlotter();
    },
};
</script>