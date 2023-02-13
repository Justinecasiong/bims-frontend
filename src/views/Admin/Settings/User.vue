<template>
    <div class="household">
        <div class="page-header">
            <div class="row">
                <div class="col-lg-8 col-md-5">
                    <h1>User</h1>
                </div>
            </div>
        </div>
        <div class="table-container table-responsive-xxl shadow">
            <div class="other-btn">
                <div class="row">
                    <div class="col">
                        <button class="btn btn-primary" v-b-modal.modal-add>
                            A
                        </button>
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Zone</th>
                        <th scope="col">Total No. of Household</th>
                        <th scope="col">Total No. of Household</th>

                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>Otto</td>
                        <td>
                            <button
                                class="btn btn-primary"
                                v-b-modal.modal-edit
                            >
                                <i class="fas fa-edit"></i>
                            </button>
                            <button
                                class="btn btn-danger"
                                v-b-modal.modal-delete
                            >
                                <i class="fas fa-file"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>Otto</td>
                        <td>
                            <button class="btn btn-primary">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger">
                                <i class="fas fa-file"></i>
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>Thornton</td>
                        <td>Larry the Bird</td>
                        <td>
                            <button class="btn btn-primary">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger">
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

        <b-modal id="modal-edit" size="md" title="Edit Zone" centered>
            <div class="form-group">
                <label for="zone" class="control-label"> Zone: </label>
                <select class="form-select" name="zone" id="zone">
                    <option value="Zone 1">Zone 1</option>
                    <option value="Zone 2">Zone 2</option>
                </select>
            </div>
            <div class="form-group">
                <label for="total" class="control-label">
                    Total No. of Household:
                </label>
                <input
                    type="number"
                    class="form-control"
                    name="total"
                    id="total"
                />
            </div>
        </b-modal>

        <b-modal id="modal-add" size="md" title="Add Zone" centered>
            <div class="form-group">
                <label for="zone" class="control-label"> Zone: </label>
                <select class="form-select" name="zone" id="zone">
                    <option value="Zone 1">Zone 1</option>
                    <option value="Zone 2">Zone 2</option>
                </select>
            </div>
            <div class="form-group">
                <label for="total" class="control-label">
                    Total No. of Household:
                </label>
                <input
                    type="number"
                    class="form-control"
                    name="total"
                    id="total"
                />
            </div>
        </b-modal>

        <b-modal id="modal-delete" size="md" title="Delete Zone" centered>
            Are you sure you want to delete this data?
        </b-modal>
    </div>
</template>