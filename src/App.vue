<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    mounted() {
        window.onpopstate = () => {
            if (
                window.localStorage.getItem("token") !== null &&
                this.$router.path == "/"
            ) {
                this.$router.push("/admin"); // redirect to home, for example
            }
        };
    },
};
</script>
