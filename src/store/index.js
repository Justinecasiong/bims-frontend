import Vue from 'vue'
import Vuex from 'vuex'
import BARANGAY_INFO from './modules/barangay_information';
import BLOTTER from './modules/blotter';
import PERMIT from './modules/business_permit';
import CHAIRMANSHIP from './modules/chairmanship';
import COVID from './modules/covid';
import HOUSEHOLD from './modules/household';
import OFFICIAL from './modules/officials';
import POSITION from './modules/position';
import RESIDENT from './modules/resident';
import REVENUE from './modules/revenue';
import ZONES from './modules/zone';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        BARANGAY_INFO,
        BLOTTER,
        PERMIT,
        CHAIRMANSHIP,
        COVID,
        HOUSEHOLD,
        OFFICIAL,
        POSITION,
        RESIDENT,
        REVENUE,
        ZONES
    }
})
