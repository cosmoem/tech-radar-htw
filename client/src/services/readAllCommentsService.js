import axios from 'axios';

export default {
    getAllComments: async () => {
        let res = await axios.get(`/api/comment`);
        return res.data || [];
    }
}
