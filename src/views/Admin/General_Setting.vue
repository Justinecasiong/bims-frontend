<template>
    <div class="container settings">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Setting</h1>
                </div>
            </div>
        </div>

        <div class="row">
            <div
                class="col-3"
                v-if="permission == 'treasurer'"
                style="cursor: pointer"
                v-b-modal.modal-gcash
            >
                <div
                    class="card card-round text-white"
                    style="margin-top: 10px; background-color: #459a7d"
                >
                    <card-body>
                        <p>GCASH QR Code</p>
                    </card-body>
                </div>
            </div>
            <div
                class="col-3"
                v-if="permission == 'chairperson' || permission == 'admin'"
                style="cursor: pointer"
                v-b-modal.view-gcash
            >
                <div
                    class="card card-round text-white"
                    style="margin-top: 10px; background-color: #459a7d"
                >
                    <card-body>
                        <p>GCASH QR Code</p>
                    </card-body>
                </div>
            </div>
            <div
                class="col-3"
                v-if="
                    permission == 'kagawad' ||
                    permission == 'sk chairman' ||
                    permission == 'admin'
                "
            >
                <router-link :to="{ name: 'Households' }">
                    <div
                        class="card card-round text-white"
                        style="margin-top: 10px; background-color: #459a7d"
                    >
                        <card-body>
                            <p>Households</p>
                        </card-body>
                    </div>
                </router-link>
            </div>
            <div class="col-3" v-if="permission == 'admin'">
                <router-link :to="{ name: 'Position' }">
                    <div
                        class="card card-round text-white"
                        style="margin-top: 10px; background-color: #459a7d"
                    >
                        <card-body>
                            <p>Positions</p>
                        </card-body>
                    </div>
                </router-link>
            </div>
            <div class="col-3" v-if="permission == 'admin'">
                <router-link :to="{ name: 'Chairmanship' }">
                    <div
                        class="card card-round text-white"
                        style="margin-top: 10px; background-color: #459a7d"
                    >
                        <card-body>
                            <p>Chairmanship</p>
                        </card-body>
                    </div>
                </router-link>
            </div>
            <div
                class="col-3"
                v-if="permission == 'chairperson' || permission == 'admin'"
            >
                <a href="http://localhost:8000/api/exportDB/" target="_blank">
                    <div
                        class="card card-round text-white"
                        style="
                            margin-top: 10px;
                            background-color: #459a7d;
                            cursor: pointer;
                        "
                    >
                        <card-body>
                            <p>Backup</p>
                        </card-body>
                    </div>
                </a>
            </div>
        </div>
        <b-modal
            id="modal-gcash"
            size="md"
            title="GCASH Payment"
            centered
            @ok.prevent="gcash.length != 0 ? updateGcash() : createGcash()"
            @hidden="resetFields()"
            ok-title="Save"
        >
            <div class="row">
                <div class="text-center mb-3" v-if="image != null">
                    <img :src="image" width="300" />
                </div>
                <div
                    class="text-center mb-3"
                    v-if="gcash.length != 0 && image == null"
                >
                    <img
                        :src="
                            'http://127.0.0.1:8000/qr_code/' +
                            this.gcash[0].image
                        "
                        width="300"
                    />
                </div>

                <div class="form-group text-center">
                    <label class="control-label">Attach GCASH QR Code:</label>
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
        <b-modal
            id="view-gcash"
            size="md"
            title="GCASH Payment"
            centered
            ok-title="Close"
            ok-only
        >
            <div class="row">
                <div class="text-center mb-3" v-if="image != null">
                    <img :src="image" width="300" />
                </div>
                <div
                    class="text-center mb-3"
                    v-if="gcash.length != 0 && image == null"
                >
                    <img
                        :src="
                            'http://127.0.0.1:8000/qr_code/' +
                            this.gcash[0].image
                        "
                        width="300"
                    />
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            permission: localStorage.getItem("permission"),
            image: null,
            id: null,
            gcash: {},
        };
    },

    methods: {
        onProfilePicChange(e) {
            if (e.target?.files[0]) {
                this.image = null;
                this.image = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.image);
                reader.onload = (e) => {
                    this.image = e.target.result;
                };
            }
        },

        async fetchGcash() {
            await axios
                .get(`/gcashQR`)
                .then((response) => {
                    this.gcash = response.data;
                    this.id = this.gcash[0].id;
                })
                .catch((error) => {
                    return error.response;
                });
        },

        async createGcash() {
            const data = {
                image: this.image,
            };
            await axios.post(`/gcashQR`, data).then((response) => {
                this.gcash = response.data;
                this.$toast.success("QR code save!");
                this.$bvModal.hide("modal-gcash");
                this.resetFields();
            });
        },

        async getDatabase() {
            await axios.get(`/exportDB`);
        },

        async updateGcash() {
            const data = {
                image: this.image,
            };
            await axios.put(`/gcashQR/${this.id}`, data).then((response) => {
                this.gcash = response.data;
                this.$toast.success("QR code save!");
                this.$bvModal.hide("modal-gcash");
                this.resetFields();
            });
        },
    },

    resetFields() {
        this.image = null;
    },

    mounted() {
        this.fetchGcash();
    },
};
</script>
