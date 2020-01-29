<template>
<div class="login">
    <div>API: {{ api }} </div>
    <div>DWP: {{'DWP' | lower}}</div>
    <div>dpw: {{'dpw' | upper}}</div>
</div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                api: process.env.VUE_APP_API
            };
        },
        mounted() {
            // js代码中使用环境变量
            console.log("BASE_URL: ", process.env.BASE_URL);
            console.log("VUE_APP_API: ", process.env.VUE_APP_API);
        }
    }
</script>

<style scoped>
 @import "../styles/login.scss";
</style>
