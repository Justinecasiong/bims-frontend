<template>
    <div class="container">
        <div class="page-header">
            <h1>Resident Information</h1>
            <div
                class="row"
                v-if="permission != 'admin' && permission != 'resident'"
            >
                <div class="dropdown col-lg-4 col-md-5">
                    <div class="form-group mb-3">
                        <label class="filter">Filter Zone:</label>
                        <select
                            class="form-select"
                            id="inputGroupSelect01"
                            v-model="search_zone"
                            v-on:click="fetchResident()"
                        >
                            <option :value="''" selected>All Zones</option>
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
                <div class="col">
                    <div class="input-group">
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Search"
                            v-model="search"
                            v-on:input="fetchResident()"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div
                class="other-btn"
                v-if="
                    permission == 'chairperson' ||
                    permission == 'secretary' ||
                    permission == 'sk chairman' ||
                    permission == 'kagawad'
                "
            >
                <div
                    class="row"
                    v-if="
                        permission == 'chairperson' ||
                        permission == 'secretary' ||
                        permission == 'sk chairman' ||
                        permission == 'kagawad'
                    "
                >
                    <div class="col">
                        <vue-excel-xlsx
                            style="border: none; background-color: white"
                            :data="json_data"
                            :columns="json_fields"
                            :file-type="'xlsx'"
                            :sheet-name="'My WorkSheet'"
                            :file-name="'ResidentList'"
                        >
                            <button
                                class="btn btn-success"
                                @click="exportExcel"
                            >
                                <i class="fas fa-file-excel"></i>
                            </button>
                        </vue-excel-xlsx>
                    </div>
                </div>
            </div>
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
                        <th scope="col">Fullname</th>
                        <th scope="col">Zones</th>
                        <th scope="col">Age</th>
                        <th scope="col">Civil Status</th>
                        <th scope="col">PWD</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(resident, index) in fetchResidents"
                        :key="resident.id"
                    >
                        <th scope="row">{{ index + 1 }}</th>
                        <td>
                            {{ resident.first_name }}
                            {{ resident.last_name }}
                        </td>
                        <td>{{ resident.zones.zone_description }}</td>
                        <td>{{ resident.age }}</td>
                        <td>{{ resident.civil_status }}</td>
                        <td>{{ resident.pwd_status }}</td>
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
                            <button
                                v-if="permission != 'resident'"
                                class="btn btn-secondary"
                                v-b-modal.modal-create
                                @click="setResidents(resident)"
                            >
                                <i class="fas fa-file"></i>
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
            id="modal-create"
            size="md"
            title="Request Certification"
            centered
            @ok.prevent="createCertificationRequest()"
            ok-only
            @hidden="resetFields()"
            ok-title="Request"
        >
            <div class="form-group">
                <label for="certification_request" class="control-label">
                    Type of Certification:
                </label>
                <select
                    class="form-select"
                    name="civil-status"
                    id="civil_status"
                    v-model="certification_id"
                >
                    <option
                        v-for="certification in certifications"
                        :key="certification.id"
                        :value="certification.id"
                    >
                        {{ certification.certification_description }}
                    </option>
                </select>
                <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
            </div>
            <div v-if="certification_id == 4">
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Business Name:
                    </label>
                    <input
                        v-model="business_name"
                        type="text"
                        class="form-control"
                        name="certification_request"
                        id="certification_request"
                    />
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Business Owner:
                    </label>
                    <input
                        v-model="business_owner"
                        type="text"
                        class="form-control"
                        name="certification_request"
                        id="certification_request"
                    />
                </div>
                <div class="form-group">
                    <label for="certification_request" class="control-label">
                        Business Nature:
                    </label>
                    <input
                        v-model="business_nature"
                        type="text"
                        class="form-control"
                        name="certification_request"
                        id="certification_request"
                    />
                </div>
            </div>

            <div class="form-group">
                <label for="certification_request" class="control-label">
                    Purpose:
                </label>
                <input
                    v-model="purpose"
                    type="text"
                    class="form-control"
                    name="certification_request"
                    id="certification_request"
                />
                <!-- <div v-if="this.errors">
                        <label style="color: red; font-weight: 500">{{
                            this.errors.purpose[0]
                        }}</label>
                    </div> -->
            </div>
            <div class="form-group">
                <label for="certification_request" class="control-label">
                    Expected Date:
                </label>
                <input
                    type="date"
                    v-model="expected_date"
                    class="form-control"
                />
                <div v-if="errors.expected_date">
                    <label style="color: red; font-weight: 500">{{
                        this.errors.expected_date
                    }}</label>
                </div>
            </div>
            <div class="form-group">
                <label for="certification_request" class="control-label">
                    Expected Time:
                </label>
                <select
                    class="form-select"
                    id="inputGroupSelect01"
                    v-model="expected_time"
                >
                    <option :value="'8:00AM-12:00NN'">8:00AM-12:00NN</option>
                    <option :value="'1:00PM-5:00PM'">1:00PM-5:00PM</option>
                </select>
                <div v-if="errors.expected_time">
                    <label style="color: red; font-weight: 500">{{
                        this.errors.expected_time
                    }}</label>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="add_modal"
            id="modal-add"
            title="Add Resident Details"
            size="xl"
            centered
            @ok.prevent="createResident()"
            ok-title="Save"
            cancel-title="Close"
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
                        <div class="form-group">
                            <input
                                v-on:change="onProfilePicChange($event)"
                                type="file"
                                id="imageFile"
                                accept="image/png, image/jpeg"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="citizenship" class="control-label">
                                    Citizenship:
                                </label>
                                <input
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
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="sex"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="LGBTQ">LGBTQ</option>
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
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="edit_modal"
            id="modal-edit"
            title="Edit Resident Details"
            size="xl"
            centered
            @ok.prevent="updateResident()"
            ok-title="Update"
            cancel-title="Close"
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
                        <div class="form-group">
                            <input
                                v-on:change="onProfilePicChange($event)"
                                type="file"
                                class="form-control"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="citizenship" class="control-label">
                                    Citizenship:
                                </label>
                                <input
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
                                    class="form-select"
                                    name="sex"
                                    id="sex"
                                    v-model="sex"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="LGBTQ">LGBTQ</option>
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
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            class="edit_modal"
            id="modal-view"
            title="Resident Details"
            size="xl"
            centered
            cancel-title="Print"
            @cancel.prevent="printDetails()"
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
                                    <option value="LGBTQ">LGBTQ</option>
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
                    </div>
                </div>
            </div>
        </b-modal>

        <b-modal
            id="modal-delete"
            size="md"
            title="Delete Resident"
            centered
            @ok.prevent="deleteResident()"
            ok-title="Delete"
            cancel-title="Close"
        >
            Are you sure you want to delete this data?
        </b-modal>

        <image-upload
            action="create"
            :image_style="{
                border: 'rounded-circle',
                height: '100',
                width: '100',
            }"
        />
    </div>
</template>


<script>
import axios from "../../axios";
import moment from "moment";
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

            resident_id: null,
            certification_id: null,
            purpose: null,
            status: null,
            time: null,
            date: null,
            expected_time: null,
            expected_date: null,
            certifications: [],

            business_name: null,
            business_owner: null,
            business_nature: null,

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

            json_fields: [
                {
                    label: "Complete name",
                    field: "fullname",
                },
                {
                    label: "Zone #",
                    field: "zone",
                },
                {
                    label: "Birthdate",
                    field: "birthdate",
                },
                {
                    label: "Age",
                    field: "age",
                },
                {
                    label: "Place of birth",
                    field: "place_of_birth",
                },
                {
                    label: "Civil Status",
                    field: "civil_status",
                },
                {
                    label: "Sex",
                    field: "sex",
                },
                {
                    label: "Contact number",
                    field: "contact_num",
                },
                {
                    label: "Occupation",
                    field: "occupation",
                },
                {
                    label: "PWD",
                    field: "pwd_status",
                },
                {
                    label: "Address",
                    field: "address",
                },
                {
                    label: "Email Address",
                    field: "email",
                },
            ],
            json_data: [],
        };
    },

    computed: {
        zones() {
            return this.$store.getters["ZONES/GET_ZONES"];
        },

        fetchResidents() {
            return this.residents.filter((data) => {
                return (
                    data.zone_id.toString().match(this.search_zone) &&
                    data.status.match("Approved")
                );
            });
        },

        fetchAllResidents() {
            return this.residents.filter((data) => {
                return data.status.match("Approved");
            });
        },
    },

    methods: {
        async fetchCertification() {
            this.loading = true;
            await axios
                .get(`/certification?page=${this.currentPage}`)
                .then((response) => {
                    this.certifications = response.data.data;
                })
                .catch((error) => {
                    return error.response;
                });
            this.loading = false;
        },

        isToday(date) {
            const today = new Date();
            if (today.toDateString() === date.toDateString()) {
                return true;
            }
            return false;
        },

        async createCertificationRequest() {
            if (
                new Date() > new Date(moment(this.expected_date).format("L")) &&
                !this.isToday(new Date(this.expected_date))
            ) {
                this.errors = {
                    expected_date: "Expected date must be today or ahead.",
                };
            } else {
                const data = {
                    resident_id: this.id,
                    certification_id: this.certification_id,
                    purpose: this.purpose,
                    expected_time: this.expected_time,
                    expected_date: this.expected_date,
                    time: this.expected_time,
                    date: this.expected_date,
                    status: "Approved",
                };

                await axios
                    .post("/certification_request", data)
                    .then((response) => {
                        console.log(response.data);
                        if (this.certification_id == 4) {
                            var data2 = {
                                business_name: this.business_name,
                                business_owner: this.business_owner,
                                business_nature: this.business_nature,
                                certification_request_id: response.data.id,
                            };

                            axios.post("/business_permit", data2);
                        }
                        this.$toast.success(
                            "Certification Request has been created."
                        );
                        this.resetFields();
                        this.$bvModal.hide("modal-create");
                    });
            }
        },

        async findResident() {
            this.loading = true;
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios
                .post(`/find-resident?page=${this.currentPage}`, data)
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

        async fetchResident() {
            this.loading = true;
            await axios
                .get(`/resident?page=${this.currentPage}&search=${this.search}`)
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

        async fetchZones() {
            await this.$store.dispatch("ZONES/FETCH_ZONES");
        },

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

        setResidents(data) {
            this.resetFields();
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
        },

        async updateResident() {
            var picture = "http://127.0.0.1:8000/img/" + this.picture;
            var profile_picture;
            if (this.profile_pic == picture) {
                profile_picture = this.picture;
            } else {
                profile_picture = this.profile_pic;
            }
            const data = {
                id: this.id,
                zone_id: this.zone_id,
                first_name: this.first_name,
                middle_name: this.middle_name,
                last_name: this.last_name,
                alias: this.alias,
                place_of_birth: this.place_of_birth,
                birthdate: this.birthdate,
                age: this.age,
                civil_status: this.civil_status,
                sex: this.sex,
                voter_status: this.voter_status,
                identified_as: this.identified_as,
                email: this.email,
                contact_num: this.contact_num,
                occupation: this.occupation,
                pwd_status: this.pwd_status,
                address: this.address,
                profile_pic: profile_picture,
                national_id: this.national_id,
                citizenship: this.citizenship,
            };

            await axios
                .put(`/resident/${data.id}`, data)
                .then(() => {
                    if (this.permission == "admin") {
                        this.$toast.success("Resident data has been updated.");
                        this.fetchResident();
                        this.resetFields();
                    } else if (this.permission == "resident") {
                        this.$toast.success("Resident data has been updated.");
                        this.findResident();
                        this.resetFields();
                    }
                    this.$bvModal.hide("modal-edit");
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },

        async deleteResident() {
            const res = await this.$store.dispatch(
                "RESIDENT/DELETE_RESIDENT",
                this.id
            );

            if (res.status == 200) {
                this.$toast.error("Resident data has been deleted.");
                this.fetchResident();
                this.resetFields();
            } else {
                this.$toast.error("Something went wrong.");
            }

            this.$bvModal.hide("modal-delete");
        },

        openModalAdd() {
            this.resetFields();
            this.$bvModal.show("modal-add");
        },

        printDetails() {
            this.$router.push({
                path: `/resident_details/${this.id}`,
            });
        },

        async fetchOfficial() {
            const data = {
                remember_token: localStorage.getItem("token"),
            };
            await axios.post(`/find-officials`, data).then((response) => {
                this.officials = response.data;
                this.search_zone = this.officials.officials.zone_id;
                this.fetchResident();
            });
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

            this.certification_id = null;
            this.purpose = null;
            this.errors = [];
            this.amount = null;
            this.payment_detail = null;
            this.expected_date = null;
            this.expected_time = null;
            this.payment_id = null;
            this.evidence = null;

            this.errors = [];
        },

        exportExcel() {
            if (
                this.permission == "sk chairman" ||
                this.permission == "kagawad"
            ) {
                this.fetchResidents.forEach((data) => {
                    this.json_data.push({
                        fullname: data.first_name + " " + data.last_name,
                        zone: data.zones.zone_description,
                        birthdate: moment(data.birthdate).format("LL"),
                        age: data.age,
                        place_of_birth: data.place_of_birth,
                        civil_status: data.civil_status,
                        sex: data.sex,
                        contact_num: data.contact_num,
                        occupation: data.occupation,
                        pwd_status: data.pwd_status,
                        address: data.address,
                        email: data.email,
                    });
                });
            } else {
                this.fetchAllResidents.forEach((data) => {
                    this.json_data.push({
                        fullname: data.first_name + " " + data.last_name,
                        zone: data.zones.zone_description,
                        birthdate: moment(data.birthdate).format("LL"),
                        age: data.age,
                        place_of_birth: data.place_of_birth,
                        civil_status: data.civil_status,
                        sex: data.sex,
                        contact_num: data.contact_num,
                        occupation: data.occupation,
                        pwd_status: data.pwd_status,
                        address: data.address,
                        email: data.email,
                    });
                });
            }
        },
    },

    mounted() {
        if (this.permission == "sk chairman" || this.permission == "kagawad") {
            this.fetchOfficial();
            this.fetchZones();
        } else if (this.permission == "resident") {
            this.findResident();
            this.fetchZones();
        } else if (this.permission == "admin" || this.permission == "chairperson" || this.permission == "secretary") {
            this.fetchResident();
            this.fetchZones();
            this.fetchCertification();
        }
    },
};
</script>
