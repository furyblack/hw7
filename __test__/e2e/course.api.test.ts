
import request from 'supertest'
import {app} from "../../src/settings";




describe ('/videos', () =>{
    it('should return 200', () => {
        request(app)
            .get('/videos')
            .expect(200,)
    });

    it('should return 200 ', () => {
        request(app)
            .get('/videos/:id')
            .expect(200,)
    });


    it( 'should return 204', () =>{
        request(app)
            .delete('/testing/all-data')
        expect(204)
    })
    it("shouldn't create video with incorrect input data", () =>{
        request(app)
            .post('/videos')
            .send({title: ''})
            .expect(400)
    })
    it('should create video with correct input data', ()=>{
        const createResponse=  request(app)
            .post('videos')
            .send({title:'title'})
            .send({author: 'string', })
            .expect(201)

    })

})
describe('/', () =>{
    it('should return f')
})
