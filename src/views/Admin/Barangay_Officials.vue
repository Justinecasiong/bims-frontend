<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Current Barangay Officials</h1>
                </div>
                <div class="col search">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchOfficial()"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <button
                class="btn btn-primary mb-3"
                v-b-modal.modal-add
                v-if="
                    permission == 'chairperson' ||
                    permission == 'secretary' ||
                    permission == 'admin'
                "
            >
                Add Officials
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
                        <th scope="col"></th>
                        <th scope="col">Fullname</th>
                        <th scope="col">Chairmanship</th>
                        <th scope="col">Barangay Position</th>
                        <th scope="col">Contact Number</th>
                        <th scope="col">Status</th>
                        <th
                            scope="col"
                            v-if="
                                permission == 'chairperson' ||
                                permission == 'secretary'
                            "
                        >
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(official, index) in officials"
                        :key="official.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <th scope="row">
                            <img
                                v-if="official.profile_pic == null"
                                class="profile-image"
                                :src="
                                    require('../../assets/images/profile_image.png')
                                "
                                height="50"
                            />
                            <img
                                v-if="official.profile_pic != null"
                                class="profile-image"
                                :src="
                                    'http://127.0.0.1:8000/img/' +
                                    official.profile_pic
                                "
                                height="50"
                            />
                        </th>
                        <td>{{ official.fullname }}</td>
                        <td>
                            {{ official.chairmanship.chairmanship_description }}
                        </td>
                        <td>{{ official.position.position_description }}</td>
                        <td>{{ official.contact_num }}</td>
                        <td>{{ official.status }}</td>
                        <td
                            v-if="
                                permission == 'chairperson' ||
                                permission == 'secretary'
                            "
                        >
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setOfficial(official)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setOfficial(official)"
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
                    v-on:input="fetchOfficial()"
                    style="align-items: flex-end"
                ></b-pagination>
            </div>
        </div>

        <b-modal
            id="modal-add"
            size="md"
            title="Add Official"
            centered
            @ok.prevent="createOfficial()"
            @hidden="resetFields()"
            ok-title="Save"
        >
            <div class="row">
                <div class="text-center" style="margin-bottom: 10px">
                    <img
                        v-if="profile_pic == null"
                        class="profile-image"
                        :src="require('../../assets/images/profile_image.png')"
                        height="200"
                    />
                    <img
                        v-if="profile_pic != null"
                        class="profile-image"
                        :src="profile_pic"
                        height="200"
                    />
                    <div class="form-group">
                        <input
                            v-on:change="onProfilePicChange($event)"
                            type="file"
                            id="imageFile"
                            accept="image/*"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="full-name" class="control-label">
                        Full Name:
                    </label>
                    <input
                        v-model="fullname"
                        type="text"
                        class="form-control"
                        id="full-name"
                        placeholder="Enter Full Name"
                    />
                    <div v-if="this.errors.fullname">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.fullname[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="chairmanship" class="control-label">
                        Chairmanship:
                    </label>
                    <select
                        class="form-select"
                        name="chairmanship"
                        id="chairmanship"
                        v-model="chairmanship_id"
                    >
                        <option
                            v-for="chairmanship in chairmanships"
                            :key="chairmanship.id"
                            :value="chairmanship.id"
                        >
                            {{ chairmanship.chairmanship_description }}
                        </option>
                    </select>
                    <div v-if="this.errors.chairmanship_id">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.chairmanship_id[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="OFFICIAL" class="control-label">
                        Barangay Position:
                    </label>
                    <select
                        class="form-select"
                        name="OFFICIAL"
                        id="OFFICIAL"
                        v-model="position_id"
                        v-on:click="setPositionID(position_id)"
                    >
                        <option
                            v-for="position in positions"
                            :key="position.id"
                            :value="position.id"
                        >
                            {{ position.position_description }}
                        </option>
                    </select>
                    <div v-if="this.errors.position_id">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.position_id[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row" v-if="position_id == 4 || position_id == 5">
                <div class="form-group">
                    <label for="OFFICIAL" class="control-label"> Zone: </label>
                    <select
                        class="form-select"
                        name="OFFICIAL"
                        id="OFFICIAL"
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
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_start" class="control-label">
                        Contact Number:
                    </label>
                    <input
                        v-model="contact_num"
                        type="number"
                        class="form-control"
                        name="term_start"
                        id="term_start"
                    />
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_start" class="control-label">
                        Term Start:
                    </label>
                    <input
                        v-model="term_start"
                        type="date"
                        class="form-control"
                        name="term_start"
                        id="term_start"
                    />
                    <div v-if="this.errors.term_start">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.term_start[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_end" class="control-label">
                        Term End:
                    </label>
                    <input
                        v-model="term_end"
                        type="date"
                        class="form-control"
                        name="term_end"
                        id="term_end"
                    />
                    <div v-if="this.errors.term_end">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.term_end[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="status" class="control-label"> Status: </label>
                    <select
                        class="form-select"
                        name="status"
                        id="status"
                        v-model="status"
                    >
                        <option value="" disabled selected>
                            Select Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div v-if="this.errors.status">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.status[0]
                        }}</label>
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-edit"
            size="md"
            title="Update Official"
            centered
            @ok.prevent="updateOfficial()"
            @hidden="resetFields()"
            ok-title="Update"
        >
            <div class="row">
                <div class="text-center" style="margin-bottom: 10px">
                    <img
                        v-if="profile_pic == null"
                        class="profile-image"
                        :src="require('../../assets/images/profile_image.png')"
                        height="200"
                    />
                    <img
                        v-if="profile_pic != null"
                        class="profile-image"
                        :src="profile_pic"
                        height="200"
                    />
                    <div class="form-group">
                        <input
                            v-on:change="onProfilePicChange($event)"
                            type="file"
                            id="imageFile"
                            accept="image/*"
                        />
                    </div>
                </div>
                <div class="form-group">
                    <label for="full-name" class="control-label">
                        Full Name:
                    </label>
                    <input
                        v-model="fullname"
                        type="text"
                        class="form-control"
                        id="full-name"
                        placeholder="Enter Full Name"
                    />
                    <div v-if="this.errors.fullname">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.fullname[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="chairmanship" class="control-label">
                        Chairmanship:
                    </label>
                    <select
                        class="form-select"
                        name="chairmanship"
                        id="chairmanship"
                        v-model="chairmanship_id"
                    >
                        <option
                            v-for="chairmanship in chairmanships"
                            :key="chairmanship.id"
                            :value="chairmanship.id"
                        >
                            {{ chairmanship.chairmanship_description }}
                        </option>
                    </select>
                    <div v-if="this.errors.chairmanship_id">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.chairmanship_id[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="OFFICIAL" class="control-label">
                        Barangay Position:
                    </label>
                    <select
                        class="form-select"
                        name="OFFICIAL"
                        id="OFFICIAL"
                        v-model="position_id"
                    >
                        <option
                            v-for="position in positions"
                            :key="position.id"
                            :value="position.id"
                        >
                            {{ position.position_description }}
                        </option>
                    </select>
                    <div v-if="this.errors.position_id">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.position_id[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row" v-if="position_id == 4 || position_id == 5">
                <div class="form-group">
                    <label for="OFFICIAL" class="control-label"> Zone: </label>
                    <select
                        class="form-select"
                        name="OFFICIAL"
                        id="OFFICIAL"
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
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_start" class="control-label">
                        Contact Number:
                    </label>
                    <input
                        v-model="contact_num"
                        type="number"
                        class="form-control"
                        name="term_start"
                        id="term_start"
                    />
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_start" class="control-label">
                        Term Start:
                    </label>
                    <input
                        v-model="term_start"
                        type="date"
                        class="form-control"
                        name="term_start"
                        id="term_start"
                    />
                    <div v-if="this.errors.term_start">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.term_start[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="term_end" class="control-label">
                        Term End:
                    </label>
                    <input
                        v-model="term_end"
                        type="date"
                        class="form-control"
                        name="term_end"
                        id="term_end"
                    />
                    <div v-if="this.errors.term_end">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.term_end[0]
                        }}</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="form-group">
                    <label for="status" class="control-label"> Status: </label>
                    <select
                        class="form-select"
                        name="status"
                        id="status"
                        v-model="status"
                    >
                        <option value="" disabled selected>
                            Select Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                    <div v-if="this.errors.status">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.status[0]
                        }}</label>
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Official"
            centered
            @ok.prevent="deleteOfficial()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            id: null,
            fullname: null,
            chairmanship_id: null,
            position_id: null,
            term_start: null,
            term_end: null,
            status: null,
            profile_pic: null,
            zone_id: null,
            contact_num: null,

            position_description: null,

            picture: null,

            officials: [],
            positions: [],
            chairmanships: [],
            errors: [],

            search: "",
            loading: false,
            currentPage: 0,
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
        onProfilePicChange(e) {
            if (e.target?.files[0]) {
                this.profile_pic = null;
                this.profile_pic = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.profile_pic);
                reader.onload = (e) => {
                    this.profile_pic = e.target.result;
                };
            }
        },

        async fetchOfficial() {
            this.loading = true;
            await axios
                .get(
                    `/barangay_officals?page=${this.currentPage}&search=${this.search}`
                )
                .then((response) => {
                    this.officials = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                    this.profile_pic = response.data.profile_pic;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        async fetchChairmanship() {
            const res = await axios
                .get(`/chairmanship?page=${this.currentPage}`)
                .then((response) => {
                    this.chairmanships = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.rows = response.data.total;
                    this.perPage = response.data.per_page;
                })
                .catch((error) => {
                    return error.response;
                });

            return res;
        },

        async fetchPosition() {
            await axios.get(`/get-positions`).then((response) => {
                this.positions = response.data;
            });
        },

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

        setPositionID(data) {
            this.position_id = data;
        },

        async createOfficial() {
            const data = {
                fullname: this.capitalize(this.fullname),
                chairmanship_id: this.chairmanship_id,
                position_id: this.position_id,
                term_start: this.term_start,
                term_end: this.term_end,
                status: this.status,
                profile_pic: this.profile_pic,
                zone_id: this.zone_id,
                contact_num: this.contact_num,
                remember_token: localStorage.getItem("token"),
            };
            await axios
                .post("/barangay_officals", data)
                .then((response) => {
                    console.log(response);
                    this.$toast.success("Official Data has been created.");
                    this.fetchOfficial();
                    this.resetFields();
                    this.$bvModal.hide("modal-add");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        setOfficial(data) {
            this.id = data.id;
            this.fullname = data.fullname;
            this.chairmanship_id = data.chairmanship_id;
            this.position_id = data.position_id;
            this.term_start = data.term_start;
            this.term_end = data.term_end;
            this.status = data.status;
            this.zone_id = data.zone_id;
            this.contact_num = data.contact_num;
            if (data.profile_pic != null) {
                this.profile_pic =
                    "http://127.0.0.1:8000/img/" + data.profile_pic;
                this.picture = data.profile_pic;
            } else {
                this.profile_pic = data.profile_pic;
            }
        },

        async updateOfficial() {
            var picture = "http://127.0.0.1:8000/img/" + this.picture;
            var profile_picture;
            if (this.profile_pic == picture) {
                profile_picture = this.picture;
            } else {
                profile_picture = this.profile_pic;
            }

            const data = {
                id: this.id,
                fullname: this.fullname,
                chairmanship_id: this.chairmanship_id,
                position_id: this.position_id,
                term_start: this.term_start,
                term_end: this.term_end,
                status: this.status,
                profile_pic: profile_picture,
                contact_num: this.contact_num,
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .put(`/barangay_officals/${data.id}`, data)
                .then((response) => {
                    console.log(response);
                    this.$toast.success("Official Data has been updated.");
                    this.fetchOfficial();
                    this.resetFields();
                    this.$bvModal.hide("modal-edit");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deleteOfficial() {
            // var data = {
            //     id: this.id,
            //     remember_token: localStorage.getItem("token"),
            // };
            await axios
                .delete(
                    `/barangay_officals/${
                        this.id
                    }?remember_token=${localStorage.getItem("token")}`
                )
                .then((response) => {
                    if (response.status == 200) {
                        this.$toast.success("Official Data has been deleted.");
                        this.fetchOfficial();
                        this.resetFields();
                    } else {
                        this.$toast.error("Something went wrong.");
                    }

                    this.$bvModal.hide("modal-delete");
                });
        },

        capitalize(data) {
            return data
                .toLowerCase()
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
        },

        async resetFields() {
            this.id = null;
            this.fullname = null;
            this.chairmanship_id = null;
            this.position_id = null;
            this.term_start = null;
            this.term_end = null;
            this.status = null;
            this.profile_pic = null;
            this.zone_id = null;
            this.contact_num = null;
            this.errors = [];
        },
    },

    mounted() {
        this.fetchOfficial();
        this.fetchChairmanship();
        this.fetchPosition();
        this.fetchZones();
    },
};
</script>