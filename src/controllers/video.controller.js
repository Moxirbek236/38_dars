import videoService from "../services/video.service.js";

class VideoController {
  constructor() {}
    async uploadVideo(req, res, next) {        
    try {
        const data = await videoService.uploadVideo(req.body, req.files.avatar_url);
        res.status(data.status).json(data);
    } catch (err) {
        next(err);
    }
    }
    async deleteVideo(req, res, next) {
        try {
            const data = await videoService.deleteVideo(req.params.id);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }
    async getAllVideos(req, res, next) {
        try {
            const data = await videoService.getAllVideos();
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }

    async updateVideo(req, res, next) {
        console.log(req.files);
        
        try {
            let data = await videoService.updateVideo(req.params.id, req.body, req.files);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }
    }

    async getVideoById(req, res, next) {
        try {
            const user_id = req.user.id;
            const data = await videoService.getVideoById(user_id);
            res.status(data.status).json(data);
        } catch (err) {
            next(err);
        }        
    }

}
export default new VideoController();