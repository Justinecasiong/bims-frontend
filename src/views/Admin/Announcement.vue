<template>
    <div class="container">
        <div class="page-header">
            <div class="row mt-3">
                <div class="col-10">
                    <h2>Announcement</h2>
                </div>
                <div
                    class="col-2"
                    v-if="permission != 'treasurer' || permission != 'admin'"
                >
                    <button
                        class="btn btn-primary"
                        v-if="permission != 'resident'"
                        v-b-modal.modal-add
                    >
                        Add Announcement
                    </button>
                </div>
            </div>
        </div>

        <div
            class="container"
            v-for="announcement in announcements"
            :key="announcement.id"
        >
            <div
                class="card card-round text-center text-white mt-4"
                style="background-color: #459a7d"
            >
                <div class="row mt-3">
                    <div class="col-2 text-start">
                        <div class="row mt-3">
                            <h2 class="fw-bold">WHAT:</h2>
                        </div>
                        <div class="row mt-3">
                            <h2 class="fw-bold">WHO:</h2>
                        </div>
                        <div class="row mt-3">
                            <h2 class="fw-bold">WHEN:</h2>
                        </div>
                        <div class="row mt-3">
                            <h2 class="fw-bold">WHERE:</h2>
                        </div>
                        <div class="row mt-3">
                            <h2 class="fw-bold">WHY:</h2>
                        </div>
                        <div class="row mt-3">
                            <h2 class="fw-bold">HOW:</h2>
                        </div>
                    </div>
                    <div class="col-7 text-start">
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_what }}</h2>
                        </div>
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_who }}</h2>
                        </div>
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_when }}</h2>
                        </div>
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_where }}</h2>
                        </div>
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_why }}</h2>
                        </div>
                        <div class="row mt-3">
                            <h2>{{ announcement.announcement_how }}</h2>
                        </div>
                    </div>
                    <div
                        class="col-2"
                        v-if="
                            permission != 'resident' ||
                            permission != 'treasurer'
                        "
                    >
                        <div
                            style="margin: auto; position: absolute; top: 50%"
                            v-if="permission != 'resident'"
                        >
                            <button
                                class="btn btn-secondary"
                                v-b-modal.modal-edit
                                @click="setPosition(announcement)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setPosition(announcement)"
                            >
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal
            class="add_modal"
            id="modal-add"
            title="Create Announcement"
            size="lg"
            centered
            @ok.prevent="createAnnouncement()"
            @cancel.prevent="resetFields()"
            @hidden="resetFields()"
            ok-title="Save"
        >
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        What:
                    </label>
                    <textarea
                        v-model="what"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Who:
                    </label>
                    <textarea
                        v-model="who"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        When:
                    </label>
                    <textarea
                        v-model="when"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Where:
                    </label>
                    <textarea
                        v-model="where"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Why:
                    </label>
                    <textarea
                        v-model="why"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        How:
                    </label>
                    <textarea
                        v-model="how"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="edit_modal"
            id="modal-edit"
            title="Edit Announcement"
            size="lg"
            centered
            @ok.prevent="updateAnnouncement()"
            ok-title="Update"
        >
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        What:
                    </label>
                    <textarea
                        v-model="what"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Who:
                    </label>
                    <textarea
                        v-model="who"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        When:
                    </label>
                    <textarea
                        v-model="when"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Where:
                    </label>
                    <textarea
                        v-model="where"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        Why:
                    </label>
                    <textarea
                        v-model="why"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
            <div class="row mt-3">
                <div class="form-group">
                    <label for="complainant" class="control-label">
                        How:
                    </label>
                    <textarea
                        v-model="how"
                        type="text"
                        class="form-control"
                        id="complainant"
                    ></textarea>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Announcement"
            centered
            @hidden="resetFields()"
            @ok.prevent="deleteAnnouncement()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>

<style>
h2 {
    font-weight: lighter;
}
</style>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            id: null,
            what: null,
            who: null,
            when: null,
            where: null,
            why: null,
            how: null,

            announcements: [],

            permission: localStorage.getItem("permission"),
        };
    },

    methods: {
        async fetchAnnouncement() {
            await axios.get("/announcement").then((response) => {
                this.announcements = response.data;
            });
        },

        async createAnnouncement() {
            const data = {
                announcement_what: this.what,
                announcement_who: this.who,
                announcement_when: this.when,
                announcement_where: this.where,
                announcement_why: this.why,
                announcement_how: this.how,
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .post("/announcement", data)
                .then(() => {
                    this.$toast.success("Announcement has been created.");
                    this.fetchAnnouncement();
                    this.resetFields();
                    this.$bvModal.hide("modal-add");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        setPosition(data) {
            this.id = data.id;
            this.what = data.announcement_what;
            this.who = data.announcement_who;
            this.when = data.announcement_when;
            this.where = data.announcement_where;
            this.why = data.announcement_why;
            this.how = data.announcement_how;
        },

        async updateAnnouncement() {
            const data = {
                id: this.id,
                announcement_what: this.what,
                announcement_who: this.who,
                announcement_when: this.when,
                announcement_where: this.where,
                announcement_why: this.why,
                announcement_how: this.how,
                remember_token: localStorage.getItem("token"),
            };

            await axios
                .put(`/announcement/${data.id}`, data)
                .then((response) => {
                    this.$toast.success("Announcement has been updated.");
                    this.fetchAnnouncement();
                    this.resetFields();
                    this.$bvModal.hide("modal-edit");
                    return response;
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deleteAnnouncement() {
            await axios
                .delete(
                    `/announcement/${
                        this.id
                    }?remember_token=${localStorage.getItem("token")}`
                )
                .then(() => {
                    this.$toast.success("Announcement has been deleted.");
                    this.fetchAnnouncement();
                    this.$bvModal.hide("modal-delete");
                });
        },

        async resetFields() {
            this.what = null;
            this.who = null;
            this.when = null;
            this.where = null;
            this.why = null;
            this.how = null;
        },
    },

    mounted() {
        this.fetchAnnouncement();
    },
};
</script>