import axios from 'axios';

export default {
    getAllComments: async (radar) => {
        let res = await axios.get(`/api/comment`);
        return res.data || [];
    }
}
