<template>
    <div class="login">
        <ul class="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
        <div class="header">
            <!-- <button type="button" class="btn btn-outline-light btn-lg">
                Register
            </button> -->
        </div>
        <div class="container-fluid">
            <div class="card">
                <div class="row row-login">
                    <div class="col">
                        <div class="image">
                            <img
                                class="profile-image"
                                :src="require('../../assets/images/logo2.png')"
                            />
                            <h5 style="margin-top: 20px; font-weight: bold">
                                BARANGAY 6-A STO. NIÑO EXT. INFORMATION AND
                                MANAGEMENT SYSTEM
                            </h5>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label">Username</label>
                        <input
                            type="text"
                            class="form-control"
                            v-model="username"
                        />
                        <div v-if="this.errors.name">
                            <label style="color: red; font-weight: 500">{{
                                this.errors.name[0]
                            }}</label>
                        </div>
                    </div>
                    <label class="control-label fw-bold">Password</label>
                    <div class="input-group">
                        <input
                            v-if="showPassword"
                            type="text"
                            class="form-control"
                            v-model="password"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                        />
                        <input
                            v-else
                            type="password"
                            class="form-control"
                            v-model="password"
                            aria-label="Recipient's username"
                            aria-describedby="button-addon2"
                        />
                        <button
                            class="btn"
                            type="button"
                            id="button-addon2"
                            @click="toggleShow"
                        >
                            <span class="icon is-small is-right">
                                <i
                                    class="fas"
                                    :class="{
                                        'fa-eye-slash': showPassword,
                                        'fa-eye': !showPassword,
                                    }"
                                ></i>
                            </span>
                        </button>
                    </div>
                    <div class="text-center">
                        <button
                            class="btn btn-warning"
                            @click="register()"
                            style="margin-top: 20px; width: 200px"
                        >
                            Register
                        </button>
                        <button
                            class="btn btn-success"
                            @click="login()"
                            style="margin-top: 20px; width: 200px"
                            v-if="!loading"
                        >
                            Login
                        </button>
                        <button
                            v-if="loading"
                            class="btn btn-success"
                            style="margin-top: 20px; width: 200px"
                            disabled
                        >
                            <span
                                class="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
export default {
    data() {
        return {
            username: null,
            password: null,

            errors: {},

            loading: false,
            showPassword: false,
        };
    },
    computed: {
        buttonLabel() {
            return this.showPassword ? "Hide" : "Show";
        },
    },

    methods: {
        toggleShow() {
            this.showPassword = !this.showPassword;
        },
        register() {
            this.$router.push("/register/user-information");
        },
        async login() {
            this.loading = true;
            const data = {
                name: this.username,
                password: this.password,
            };

            await axios
                .post("/login", data)
                .then((response) => {
                    localStorage.setItem("token", response.data.token);

                    localStorage.setItem(
                        "permission",
                        response.data.permission
                    );

                    if (response.data.permission == "resident") {
                        localStorage.setItem(
                            "resident_id",
                            response.data.resident_id
                        );
                    }

                    this.$router.push("/dashboard");
                    console.log(response);
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.error);
                });
            this.loading = false;
        },
    },
};
</script>
