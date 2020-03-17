<template>
    <div class="container">
        <p>欢迎来到vue的世界</p>
        {{msg}}
    </div>
</template>
<script>
export default {
    data(){
        return{
            msg:'Hello World'
        }
    }
}
</script>
<style lang="less" scoped>
.container{
    p{
        color: green;
    }
}
</style>