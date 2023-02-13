<template>
    <div>
        <div style="text-align: right; margin-bottom: 20px">
            <button class="btn btn-primary" v-print="'#certificate'">
                PRINT <i class="fas fa-print"></i>
            </button>
        </div>

        <div class="certificate" id="certificate">
            <div class="header mt-5">
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
                    <div class="col contents">
                        <div class="header">
                            <h2
                                style="
                                    font-weight: bold;
                                    text-decoration: underline;
                                "
                            >
                                Resident Profile
                            </h2>
                        </div>

                        <br />
                        <div class="row text-center">
                            <div class="col-4"></div>
                            <div class="col-4">
                                <img
                                    v-if="residents[0].profile_pic == null"
                                    class="profile-image"
                                    :src="
                                        require('../../../assets/images/profile_image.png')
                                    "
                                />
                                <img
                                    v-if="residents[0].profile_pic != null"
                                    :src="
                                        'http://127.0.0.1:8000/img/' +
                                        residents[0].profile_pic
                                    "
                                    height="200"
                                />
                            </div>
                            <div class="col-4"></div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Name:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="fullname"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Birthday:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="birthdate"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Age:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].age"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Alias:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].alias"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Gender:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].sex"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Civil Status:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].civil_status"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Phone number:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].contact_num"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Email address:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].email"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Occupation:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].occupation"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Zone:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="
                                            residents[0].zones.zone_description
                                        "
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Voter's Status:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].voter_status"
                                    />
                                </div>
                            </div>
                            <div class="col">
                                <div class="form-group">
                                    <label for="age" class="control-label">
                                        Identified as:
                                    </label>
                                    <input
                                        readonly
                                        class="form-control"
                                        id="age"
                                        v-model="residents[0].identified_as"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="form-group">
                                <label for="age" class="control-label">
                                    Education Status:
                                </label>
                                <textarea
                                    readonly
                                    class="form-control"
                                    id="age"
                                    v-model="residents[0].educational_status"
                                ></textarea>
                            </div>
                        </div>
                        <div class="row mt-4">
                            <div class="form-group">
                                <label for="age" class="control-label">
                                    Address:
                                </label>
                                <textarea
                                    readonly
                                    class="form-control"
                                    id="age"
                                    v-model="residents[0].address"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Print from "vue-print-nb";
import moment from "moment";
export default {
    props: ["id"],

    directives: {
        Print,
    },

    data() {
        return {
            fullname: "",
            birthdate: "",
            moment: moment,
        };
    },
    computed: {
        residents() {
            return this.$store.getters["RESIDENT/GET_RESIDENT"];
        },
    },

    async mounted() {
        await this.$store.dispatch("RESIDENT/FETCH_RESIDENT_BY_ID", this.id);
        this.fullname =
            this.residents[0].first_name + " " + this.residents[0].last_name;
        this.birthdate = moment(this.residents[0].birthdate).format("LL");
    },
};
</script>