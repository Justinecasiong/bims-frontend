<template>
    <div>
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Positions</h1>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div class="other-btn">
                <div class="row">
                    <div class="col">
                        <button
                            class="btn btn-primary"
                            v-b-modal.modal-add
                            @click="setEditorContent"
                        >
                            A
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Position</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(position, index) in positions"
                        :key="position.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ position.position_description }}</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                                @click="setPosition(position)"
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                                @click="setPosition(position)"
                            >
                                <i class="fas fa-file"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="row footer">
                <div class="col">Total 3 entries</div>
                <div class="col pagination">Pagination</div>
            </div>
        </div>

        <b-modal
            id="modal-edit"
            size="md"
            title="Edit Position"
            centered
            @ok.prevent="updatePosition()"
            @hidden="resetFields()"
            ok-title="Update"
        >
            <div class="form-group">
                <label for="position" class="control-label"> Position: </label>
                <input
                    v-model="position_description"
                    type="text"
                    class="form-control"
                    name="Position"
                    id="Position"
                />
                <div v-if="this.errors.length != 0">
                    <label style="color: red; font-weight: 500">{{
                        this.errors.position_description[0]
                    }}</label>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-add"
            size="lg"
            title="Add Position"
            centered
            @ok.prevent="createPosition()"
            @hidden="resetFields()"
            ok-title="Save"
        >
            <VueEditor v-model="htmlForEditor" />
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Zone"
            centered
            @hidden="resetFields()"
            @ok.prevent="deletePosition()"
            ok-title="Delete"
        >
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>

<script>
import axios from "../../axios";
import { VueEditor } from "vue2-editor";
export default {
    components: {
        VueEditor,
    },

    data() {
        return {
            id: null,
            position_description: null,
            positions: [],
            errors: [],
            htmlForEditor: null,
        };
    },

    methods: {
        setEditorContent: function () {
            this.htmlForEditor = "<h5>Republic of the Philippines</h5>";
        },
        async fetchPosition() {
            await axios.get("/position").then((response) => {
                this.positions = response.data;
            });
        },

        async createPosition() {
            const data = {
                position_description: this.position_description,
            };

            await axios
                .post("/position", data)
                .then((response) => {
                    console.log(response.data);
                    this.$toast.success("Position Title has been created.");
                    this.fetchPosition();
                    this.resetFields();
                    this.$bvModal.hide("modal-add");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        setPosition(data) {
            this.id = data.id;
            this.position_description = data.position_description;
        },

        async updatePosition() {
            const data = {
                id: this.id,
                position_description: this.position_description,
            };

            await axios
                .put(`/position/${data.id}`, data)
                .then((response) => {
                    this.$toast.success("Position Title has been updated.");
                    this.fetchPosition();
                    this.resetFields();
                    this.$bvModal.hide("modal-edit");
                    return response;
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deletePosition() {
            const res = await this.$store.dispatch(
                "POSITION/DELETE_POSITION",
                this.id
            );

            if (res.status == 200) {
                this.$toast.error("Position Title has been deleted.");
                this.fetchPosition();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-delete");
        },

        async resetFields() {
            this.position_description = null;
            this.errors = [];
        },
    },

    mounted() {
        this.fetchPosition();
    },
};
</script>