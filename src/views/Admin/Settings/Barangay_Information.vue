<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>Barangay Information</h1>
                </div>
            </div>
        </div>

        <div class="container info">
            <div class="row">
                <div class="col-sm-12 col-lg-6">
                    <div class="form-group">
                        <label for="province" class="control-label">
                            Province:
                        </label>
                        <input
                            v-model="province"
                            type="text"
                            class="form-control"
                            name="province"
                            id="province"
                        />
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="municipality" class="control-label">
                            Municipality:
                        </label>
                        <input
                            v-model="municipality"
                            type="text"
                            class="form-control"
                            name="municipality"
                            id="municipality"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-lg-6">
                    <div class="form-group">
                        <label for="barangay" class="control-label">
                            Barangay:
                        </label>
                        <input
                            v-model="barangay"
                            type="text"
                            class="form-control"
                            name="barangay"
                            id="barangay"
                        />
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="contact_no" class="control-label">
                            Contact Number:
                        </label>
                        <input
                            v-model="contact_num"
                            type="text"
                            class="form-control"
                            name="contact_no"
                            id="contact_no"
                        />
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="barangay_info" class="control-label">
                    Barangay Information:
                </label>
                <textarea
                    v-model="description"
                    type="text"
                    class="form-control"
                    name="barangay_info"
                    id="barangay_info"
                ></textarea>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="city_logo" class="control-label">
                            Municipality / City Logo:
                        </label>
                        <br />
                        <img
                            :src="previewMunicipalityImage"
                            style="width: 120px"
                        />
                        <div class="form-group">
                            <input
                                v-on:change="onMunicipalityLogoChange($event)"
                                type="file"
                                id="imageFile"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </div>
                </div>
                <div class="col-sm-12 col-lg-6">
                    <div class="form-group">
                        <label for="city_logo" class="control-label">
                            Barangay Logo:
                        </label>
                        <br />
                        <img :src="previewBarangayImage" style="width: 120px" />
                        <div class="form-group">
                            <input
                                v-on:change="onBarangayLogoChange($event)"
                                type="file"
                                id="imageFile"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label for="city_logo" class="control-label">
                    Barangay Hall Image:
                </label>
                <br />
                <img :src="previewHallImage" />
                <div class="form-group">
                    <input
                        v-on:change="onHallLogoChange($event)"
                        type="file"
                        id="imageFile"
                        accept="image/png, image/jpeg"
                    />
                </div>
            </div>
        </div>
        <br />
        <div class="buttons">
            <button class="btn btn-warning" @click="saveBarangayInfo()">
                <i class="fas fa-trash-alt"></i>
                Update
            </button>
            <button class="btn btn-success">
                <i class="fas fa-trash-alt"></i>
                Save
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: "",
            province: "",
            municipality: "",
            barangay: "",
            contact_num: "",
            description: "",
            previewMunicipalityImage: "",
            previewBarangayImage: require("../../../assets/images/profile_image.png"),
            previewHallImage: require("../../../assets/images/profile_image.png"),
        };
    },

    computed: {
        barangay_infos() {
            return this.$store.getters["BARANGAY_INFO/GET_INFO"];
        },
    },

    methods: {
        async onChangeBarangayInfo() {
            await this.$store.dispatch("BARANGAY_INFO/FETCH_INFO");
            this.id = this.barangay_infos[0].id;
            this.province = this.barangay_infos[0].province;
            this.municipality = this.barangay_infos[0].municipality;
            this.barangay = this.barangay_infos[0].barangay;
            this.contact_num = this.barangay_infos[0].contact_num;
            this.description = this.barangay_infos[0].description;
            this.previewMunicipalityImage =
                this.barangay_infos[0].muncipality_logo;
            this.previewBarangayImage = this.barangay_infos[0].barangay_logo;
            this.previewHallImage = this.barangay_infos[0].hall_logo;
        },

        onMunicipalityLogoChange(e) {
            if (e.target?.files[0]) {
                this.previewMunicipalityImage = null;
                this.muncipality_logo = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.muncipality_logo);
                reader.onload = (e) => {
                    this.previewMunicipalityImage = e.target.result;
                };
            }
        },

        onBarangayLogoChange(e) {
            if (e.target?.files[0]) {
                this.previewBarangayImage = null;
                this.barangay_logo = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.barangay_logo);
                reader.onload = (e) => {
                    this.previewBarangayImage = e.target.result;
                };
            }
        },

        onHallLogoChange(e) {
            if (e.target?.files[0]) {
                this.previewHallImage = null;
                this.hall_logo = e.target?.files[0] ?? "";
                let reader = new FileReader();
                reader.readAsDataURL(this.hall_logo);
                reader.onload = (e) => {
                    this.previewHallImage = e.target.result;
                };
            }
        },

        async saveBarangayInfo() {
            var data = {
                id: this.id,
                province: this.province,
                municipality: this.muncipality,
                barangay: this.barangay,
                contact_num: this.contact_num,
                description: this.description,
                municipality_logo: this.previewMunicipalityImage,
                barangay_logo: this.previewBarangayImage,
                // hall_logo: this.previewHallImage,
            };

            const res = await this.$store.dispatch(
                "BARANGAY_INFO/UPDATE_INFO",
                data
            );

            if (res.status == 200) {
                this.$toast.success("Barangay Information has been updated.");
            }
        },
    },

    mounted() {
        this.onChangeBarangayInfo();
    },
};
</script>