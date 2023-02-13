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

        <div class="container register">
            <div class="card text-center p-5">
                <h1>
                    Please wait for barangay officials to approve your
                    registration
                </h1>
                <h3 class="mt-4">
                    This will be the format of your default username and
                    password LastnameFirstnameYearMonthDay Ex.
                    <span class="fw-bold">DelacruzJuan20001125</span>
                </h3>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        setTimeout(() => {
            this.$router.push("/");
        }, 10000);
    },
};
</script>