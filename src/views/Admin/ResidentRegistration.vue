.<template>
    <div class="container">
        <div class="page-header">
            <h1>Resident Registration</h1>
        </div>
        <div class="table-container table-responsive-xxl shadow">
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
                        v-for="(resident, index) in residents"
                        :key="resident.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>
                            {{ resident.first_name }}
                            {{ resident.last_name }}
                        </td>
                        <td>{{ resident.zones.zone_description }}</td>
                        <td>
                            <button
                                v-if="
                                    permission == 'admin' ||
                                    permission == 'resident'
                                "
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setResidents(resident)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                v-b-modal.modal-view
                                @click="setResidents(resident)"
                                class="btn btn-primary"
                                v-if="
                                    permission != 'admin' &&
                                    permission != 'resident'
                                "
                            >
                                <i class="fas fa-eye"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setResidents(resident)"
                                v-if="permission == 'admin'"
                            >
                                <i class="fas fa-trash-alt"></i>
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

        <b-modal
            class="edit_modal"
            id="modal-view"
            title="Resident Details"
            size="xl"
            centered
            ok-title="Approve"
            cancel-title="Reject"
            @ok.prevent="approveUser()"
            @cancel.prevent="deleteUser()"
            @hidden="resetFields()"
        >
            <div class="row">
                <div class="col-lg-4">
                    <div class="row text-center">
                        <img
                            v-if="profile_pic == null"
                            class="profile-image"
                            :src="
                                require('../../assets/images/profile_image.png')
                            "
                        />
                        <img
                            v-if="profile_pic != null"
                            class="profile-image"
                            :src="profile_pic"
                        />
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="citizenship" class="control-label">
                                    Citizenship:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="national-id"
                                    placeholder="Enter Citizenship"
                                    v-model="citizenship"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col">
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    First Name:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="first-name"
                                    placeholder="Enter First Name"
                                    v-model="first_name"
                                />
                                <div v-if="this.errors.first_name">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.first_name[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="middle-name" class="control-label">
                                    Middle Name:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="middle-name"
                                    placeholder="Enter Middle Name"
                                    v-model="middle_name"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="last-name" class="control-label">
                                    Last Name:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="last-name"
                                    placeholder="Enter Last Name"
                                    v-model="last_name"
                                />
                                <div v-if="this.errors.last_name">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.last_name[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="alias" class="control-label">
                                    Alias:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="alias"
                                    placeholder="Enter Alias"
                                    v-model="alias"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="birthplace" class="control-label">
                                    Place of Birth:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="birthplace"
                                    placeholder="Enter Birthplace"
                                    v-model="place_of_birth"
                                />
                                <div v-if="this.errors.place_of_birth">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.place_of_birth[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="birthdate" class="control-label">
                                    Birthdate:
                                </label>
                                <input
                                    readonly
                                    type="date"
                                    class="form-control"
                                    id="birthdate"
                                    placeholder="Enter Birthdate"
                                    v-model="birthdate"
                                />
                                <div v-if="this.errors.birthdate">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.birthdate[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="age" class="control-label">
                                    Age:
                                </label>
                                <input
                                    readonly
                                    type="number"
                                    class="form-control"
                                    id="age"
                                    placeholder="Enter Age"
                                    v-model="age"
                                />
                                <div v-if="this.errors.age">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.age[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="civil-status" class="control-label">
                                    Civil Status:
                                </label>
                                <select
                                    class="form-select"
                                    name="civil-status"
                                    id="civil_status"
                                    v-model="civil_status"
                                    disabled
                                >
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                                <div v-if="this.errors.civil_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.civil_status[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Sex:
                                </label>
                                <select
                                    disabled
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="sex"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <div v-if="this.errors.sex">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.sex[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Zone:
                                </label>
                                <select
                                    disabled
                                    class="form-select"
                                    name="zone"
                                    id="zone"
                                    v-model="zone_id"
                                >
                                    <option
                                        v-for="zone in zones"
                                        :key="zone.id"
                                        :value="zone.id"
                                    >
                                        {{ zone.zone_description }}
                                    </option>
                                </select>
                                <div v-if="this.errors.zone_id">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.zone_id[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Voter's Status:
                                </label>
                                <select
                                    disabled
                                    class="form-select"
                                    name="voter-status"
                                    id="voter_status"
                                    v-model="voter_status"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <div v-if="this.errors.voter_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.voter_status[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="first-name" class="control-label">
                                    Identified as:
                                </label>
                                <select
                                    disabled
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="identified_as"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                                <div v-if="this.errors.identified_as">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{
                                            this.errors.identified_as[0]
                                        }}</label
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="email-add" class="control-label">
                                    Email Address:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="email-add"
                                    placeholder="Enter Email Address"
                                    v-model="email"
                                />
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label
                                    for="contact-number"
                                    class="control-label"
                                >
                                    Contact Number:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="contact-number"
                                    placeholder="Enter Contact Number"
                                    v-model="contact_num"
                                />
                                <div v-if="this.errors.contact_num">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.contact_num[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="occupation" class="control-label">
                                    Occupation:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="occupation"
                                    placeholder="Enter Occupation"
                                    v-model="occupation"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="pwd-status" class="control-label">
                                    PWD Status:
                                </label>
                                <select
                                    disabled
                                    class="form-select"
                                    name="pwd-status"
                                    id="pwd_status"
                                    v-model="pwd_status"
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                                <div v-if="this.errors.pwd_status">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.pwd_status[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label for="address" class="control-label">
                                    Address:
                                </label>
                                <input
                                    readonly
                                    type="text"
                                    class="form-control"
                                    id="address"
                                    placeholder="Enter Address"
                                    v-model="address"
                                />
                                <div v-if="this.errors.address">
                                    <label
                                        style="color: red; font-weight: 500"
                                        >{{ this.errors.address[0] }}</label
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group text-center mt-4">
                                <button
                                    type="button"
                                    class="btn btn-outline-primary mb-3"
                                    v-b-modal.modal-view-id
                                >
                                    View uploaded ID upon registration
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="edit_modal"
            id="modal-view-id"
            title="ID Details"
            centered
            ok-only
            ok-title="Close"
        >
            <div
                class="row text-center"
                v-if="
                    this.identification_img != null && this.identifation != null
                "
            >
                <img
                    :src="
                        'http://127.0.0.1:8000/identification/' +
                        this.identification_img
                    "
                    height="300"
                />
                <h5 style="font-style: italic" class="fw-bold mt-3">
                    {{ this.identifation }}
                </h5>
            </div>

            <div
                class="row text-center"
                v-if="
                    this.identification_img == null || this.identifation == null
                "
            >
                <h4 style="font-style: italic" class="fw-bold mt-3">
                    No ID uploaded!
                </h4>
            </div>
        </b-modal>
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
            identifation: null,
            identification_img: null,

            picture: null,

            residents: [],
            officials: [],
            errors: [],

            search: "",
            search_zone: "",

            loading: false,
            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),
        };
    },

    computed: {
        zones() {
            return this.$store.getters["ZONES/GET_ZONES"];
        },
    },

    methods: {
        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

        async fetchOfficial() {
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios.post(`/find-officials`, data).then((response) => {
                this.officials = response.data;
                this.search_zone = this.officials.officials.zone_id;
                this.resetFields();
                this.residents = [];
                this.fetchResident();
            });

            await axios
                .get(
                    `/pending-residents?page=${this.currentPage}&search=${this.search}`
                )
                .then((response) => {
                    this.residents = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                });
        },

        async fetchResident() {
            this.loading = true;
            await axios
                .get(
                    `/pending-residents?page=${this.currentPage}&search=${this.search}`
                )
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

        async approveUser() {
            this.loading = true;
            var data = {
                id: this.id,
            };
            await axios
                .post(`/accept-user`, data)
                .then(() => {
                    this.$toast.success("User successfully approved!");
                    this.$bvModal.hide("modal-view");
                    this.resetFields();
                    this.residents = [];
                    this.fetchResident();
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async deleteUser() {
            const res = await this.$store.dispatch(
                "RESIDENT/DELETE_RESIDENT",
                this.id
            );

            if (res.status == 200) {
                this.$toast.success("User has been rejected.");
                this.resetFields();
                this.residents = [];
                this.fetchResident();
                this.$bvModal.hide("modal-view");
            } else {
                this.$toast.error("Something went wrong.");
            }
        },

        setResidents(data) {
            if (data.profile_pic != null) {
                this.profile_pic =
                    "http://127.0.0.1:8000/img/" + data.profile_pic;
                this.picture = data.profile_pic;
            } else {
                this.profile_pic = data.profile_pic;
            }
            this.id = data.id;
            this.zone_id = data.zone_id;
            this.first_name = data.first_name;
            this.middle_name = data.middle_name;
            this.last_name = data.last_name;
            this.alias = data.alias;
            this.place_of_birth = data.place_of_birth;
            this.birthdate = data.birthdate;
            this.age = data.age;
            this.civil_status = data.civil_status;
            this.sex = data.sex;
            this.voter_status = data.voter_status;
            this.identified_as = data.identified_as;
            this.email = data.email;
            this.contact_num = data.contact_num;
            this.occupation = data.occupation;
            this.pwd_status = data.pwd_status;
            this.address = data.address;
            this.national_id = data.national_id;
            this.citizenship = data.citizenship;
            this.identifation = data.identifation;
            this.identification_img = data.identification_img;
        },

        resetFields() {
            this.id = null;
            this.zone_id = null;
            this.first_name = null;
            this.middle_name = null;
            this.last_name = null;
            this.alias = null;
            this.place_of_birth = null;
            this.birthdate = null;
            this.age = null;
            this.civil_status = null;
            this.sex = null;
            this.voter_status = null;
            this.identified_as = null;
            this.email = null;
            this.contact_num = null;
            this.occupation = null;
            this.pwd_status = null;
            this.address = null;
            this.profile_pic = null;
            this.national_id = null;
            this.citizenship = null;
            this.identifation = null;
            this.identification_img = null;

            this.errors = [];
        },
    },

    mounted() {
        if (this.permission == "sk chairman" || this.permission == "kagawad") {
            this.fetchOfficial();
        }
        if (this.permission == "sk chairman" || this.permission != "kagawad") {
            this.fetchResident();
            this.fetchZones();
        }
    },
};
</script>