<template>
    <div class="container">
        <div class="page-header">
            <div class="row">
                <div class="col-10">
                    <h1>Analytics</h1>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="card shadow text-center">
                    <div class="card-header">
                        <div class="card-title fw-bold">
                            Population Analytics
                        </div>
                    </div>
                    <GChart
                        type="LineChart"
                        :data="populationData"
                        :options="populationOptions"
                    />
                </div>
            </div>
            <div class="row">
                <b class="mb-3" v-if="this.perscription">Suggested solution:</b>
                <b>{{ this.perscription }}</b> <br />
                <h5>{{ this.definition }}</h5>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../axios";
import { GChart } from "vue-google-charts/legacy";
import moment from "moment";
import SimpleLinearRegression from "ml-regression-simple-linear";
export default {
    components: {
        GChart,
    },
    data() {
        return {
            residents: [],
            search: "",
            loading: false,
            moment: moment,

            currentPage: 1,
            rows: 0,
            perPage: 0,

            permission: localStorage.getItem("permission"),
            resident_id: localStorage.getItem("resident_id"),

            male: 0,
            female: 0,
            pwd: 0,
            senior: 0,
            dominant: 0,
            dominantAge: 0,

            perscription: null,
            definition: null,

            populationData: [],
            populationOptions: {
                // vAxis: {
                //     format: "percent",
                // },
                // isStacked: true,
                legend: { position: "top", maxLines: 3 },
                bar: { groupWidth: "75%" },
                height: 400,
                series: {
                    0: { color: "#4D8FDE" },
                    1: { color: "#48CCCC" },
                    2: { color: "#B3572F" },
                    3: { color: "#9D369D" },
                    4: { color: "#B74545" },
                    5: { color: "#3CA33C" },
                },
            },
        };
    },

    methods: {
        async countPopulation() {
            await axios.get(`/count-total-population`).then((response) => {
                this.residents = parseInt(response.data);
            });

            await axios.get(`/count-population`).then((response) => {
                this.male = response.data[0];
                this.female = response.data[1];
                this.pwd = response.data[2];
                this.senior = response.data[3];
                this.dominant = response.data[4];
                this.dominantAge = response.data[5];
            });

            const x = [0, 1, 2];
            const y = [1654, 1610, this.residents];

            const regression = new SimpleLinearRegression(x, y);
            const json = regression.toJSON();
            const loaded = SimpleLinearRegression.load(json);
            const prediction = loaded.predict(3);

            this.populationData.push(
                ["Year", "Population"],
                ["2020", 1654],
                ["2021", 1610],
                ["2022", this.residents],
                ["Predicted population by 2023", Math.floor(prediction)]
            );

            if (this.residents >= 1000 && this.residents <= 1200) {
                this.perscription = "Pre-Marriage counselling";
                this.definition =
                    "a half day orientation program for couples applying for marriage license.  It is designed to provide pre-marriage couples with a realistic view of what marriage is all about.";
            }
            if (this.residents >= 1201 && this.residents <= 1400) {
                this.perscription = "Magna Carta of Women";
                this.definition =
                    "On Gender and Development, the MAGNA CARTA OF WOMEN mandates all government offices, including government-owned and controlled corporations and local government units to adopt GENDER MAINSTREAMING as a strategy for implementing the law and attaining its objectives.";
            }
            if (this.residents >= 1401 && this.residents <= 1700) {
                this.perscription =
                    "Learning package for parent education on adolescent health and development (LPPED)";
                this.definition =
                    "to equip parents with the necessary knowledge on adolescent sexual and reproductive health concerns as well as skills on how to communicate these concerns to their adolescent children.";
            }
            if (this.residents >= 1701 && this.residents <= 2000) {
                this.perscription =
                    "Responsible Parenthood and Family Planning Program";
                this.definition =
                    "is the Responsible Parenting Movement (RPM).  The Responsible Parenting Movement is a program to organize and activate a group of parents who would want to take on responsible parenting as a way of life.";
            }
        },
    },

    mounted() {
        this.countPopulation();
    },
};
</script>