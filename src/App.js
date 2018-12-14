import React, {Component} from 'react';
import {Layout, Card, Col, Row, Select, DatePicker} from 'antd';
import './App.css';
import "antd/dist/antd.css";
import moment from 'moment';

const dateFormat = 'YYYY/MM/DD';
const {Content} = Layout;
const Option = Select.Option;
const apiKey = 'aZlmHCp3jD9sanwE8KvytidYArlTvlhwr3fEhYyM';
const {Meta} = Card;
const emptyImage = 'https://upload.wikimedia.org/wikipedia/commons/6/6c/No_image_3x4.svg';
const loadingIcon = 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            galleryData: [],
            galleryCuriosityData: [],
            galleryOpportunityData: [],
            curiosityDisplayData: ['', '', '', ''].fill({
                img_src: emptyImage,
                camera: {
                    name: '',
                },
                rover: {
                    name: '',
                }
            }, 0, 4),
            opportunityDisplayData: ['', '', '', ''].fill({
                img_src: emptyImage,
                camera: {
                    name: '',
                },
                rover: {
                    name: '',
                }
            }, 0, 4),
            curiosityStartIndex: 0,
            opportunityStartIndex: 0,
            showDay: true,
            showGallery: false,
            showPrev: true,
            showNext: true,
            showPrevOpp: true,
            showNextOpp: true,
            earthDate: '',
            random: '',
            dayImage: {
                img_src: loadingIcon,
                camera: {
                    name: '',
                },
                rover: {
                    name: '',
                }
            },

        };
    }

    handleChange(rover, e) {
        let datestring = this.getDateValue('String');
        let cameraUrl = 'https://api.nasa.gov/mars-photos/api/v1/rovers/' + rover + '/photos?earth_date=' + datestring + '&camera=' + e + '&api_key=' + apiKey;
        fetch(cameraUrl).then(res => res.json()).then((result) => {
            if (rover === "Curiosity") {
                this.setState({
                    galleryCuriosityData: result.photos,
                    curiosityDisplayData: result.photos.slice(0, 4),
                    showPrev: false,
                    showNext: result.photos.length >= 4 ? true : false,
                })
            } else {
                this.setState({
                    galleryOpportunityData: result.photos,
                    opportunityDisplayData: result.photos.slice(0, 4),
                    showPrevOpp: false,
                    showNextOpp: result.photos.length >= 4 ? true : false,
                })
            }
        })
    }

    toggleDay = () => {
        this.setState({
            showDay: true,
            showGallery: false,
        });
    }
    showGallery = () => {
        this.setState({
            showDay: false,
            showGallery: true,
        });
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    slidePrev() {
        let curIndex = this.state.curiosityStartIndex;
        if (curIndex == 0) {
            this.setState({
                showPrev: false,
                showNext: true,
            })
        } else {
            let newIndex = curIndex - 1;
            this.setState({
                curiosityDisplayData: this.state.galleryCuriosityData.slice(newIndex, newIndex + 4),
                curiosityStartIndex: newIndex,
                showNext: true,
            })
        }
    }

    slideNext() {
        let len = this.state.galleryCuriosityData.length;
        let curIndex = this.state.curiosityStartIndex;

        if (curIndex + 3 > len) {
            this.setState({
                showNext: false,
                showPrev: true,
            })
        } else {
            let newIndex = curIndex + 1;
            this.setState({
                curiosityDisplayData: this.state.galleryCuriosityData.slice(newIndex, newIndex + 4),
                curiosityStartIndex: newIndex,
                showPrev: true,
            })
        }
    }

    slidePrevOpp() {
        let curIndex = this.state.opportunityStartIndex;
        if (curIndex == 0) {
            this.setState({
                showPrevOpp: false,
                showNextOpp: true,
            })
        } else {
            let newIndex = curIndex - 1;
            this.setState({
                opportunityDisplayData: this.state.galleryOpportunityData.slice(newIndex, newIndex + 4),
                opportunityStartIndex: newIndex,
                showNextOpp: true,
            })
        }
    }

    slideNextOpp() {
        let len = this.state.galleryOpportunityData.length;
        let curIndex = this.state.opportunityStartIndex;
        if (curIndex + 3 > len) {
            this.setState({
                showNextOpp: false,
                showPrevOpp: true,
            })
        } else {
            let newIndex = curIndex + 1;
            this.setState({
                opportunityDisplayData: this.state.galleryOpportunityData.slice(newIndex, newIndex + 4),
                opportunityStartIndex: newIndex,
                showPrevOpp: true,
            })
        }
    }

    changeDate(date, dateString) {
        this.setState({
            earthDate: dateString,
        })
        let queryOpportunityUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?earth_date=" + dateString + "&api_key=" + apiKey;
        fetch(queryOpportunityUrl).then(res => res.json()).then((result) => {
            this.setState({
                galleryOpportunityData: result.photos,
                opportunityDisplayData: result.photos.slice(0, 4),
                showPrevOpp: false,
                showNextOpp: result.photos.length >= 4 ? true : false,

            })
            let queryCuriousityUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" + dateString + "&api_key=" + apiKey;
            fetch(queryCuriousityUrl).then(res => res.json()).then((result) => {
                this.setState({
                    galleryCuriosityData: result.photos,
                    curiosityDisplayData: result.photos.slice(0, 4),
                    showPrev: false,
                    showNext: result.photos.length >= 4 ? true : false,
                })
                this.selectDayImage();
            })
        })
    }

    render() {
        return (
            <div className="App">
                <div style={{float: 'bottom', height: '100%'}}>
                    <h1 className="h1">The Red
                        Planet Rovers</h1>
                    <div className="datePicker"><DatePicker defaultValue={moment(this.getDateValue(), dateFormat)}
                                   onChange={this.changeDate.bind(this)} size='large'/></div>
                    <h3 onClick={this.toggleDay} className="mainButton">Image of the Day</h3>
                    <h3 onClick={this.showGallery} className="mainButton">Image Gallery</h3>

                </div>
                <hr style={{margin: '0px'}}></hr>
                <Content style={{padding: '0 0'}} hidden={!this.state.showDay}>
                    <h3 style={{padding: '20px 250px', width: '60%', textAlign: 'left'}}>Image of the Day</h3>
                    <div>
                        <img style={{padding: '20px 0px', width: '60%', height: '60%'}} alt=""
                             src={this.state.dayImage.img_src}></img>
                        <div style={{padding: '0px 0px 40px 0px', width: '75%', textAlign: 'right'}}>
                            <div>
                                {this.state.dayImage.camera.name} {this.state.dayImage.rover.name}
                            </div>
                            <div>
                                {moment(this.state.dayImage.earth_date).format('MMMM DD YYYY')}
                            </div>
                        </div>
                    </div>
                </Content>
                <Content style={{padding: '0 0px'}} hidden={!this.state.showGallery}>
                    <h2 className="cameraTitle">Curiosity: Navigation Camera</h2>
                    <div className="cameraSelect">
                        <Select showSearch defaultValue="Camera Name" style={{width: 320, fontWeight: 'bold'}}
                                onSelect={this.handleChange.bind(this, 'Curiosity')}>
                            <Option value="FHAZ">Front Hazard Avoidance Camera</Option>
                            <Option value="RHAZ">Rear Hazard Avoidance Camera</Option>
                            <Option value="MAST">Mast Camera</Option>
                            <Option value="CHEMCAM">Chemistry and Camera Complex</Option>
                            <Option value="MAHLI">Mars Hand Lens Imager</Option>
                            <Option value="MARDI">Mars Descent Imager</Option>
                            <Option value="NAVCAM">Navigation Camera</Option>
                        </Select>
                    </div>

                    <div className="container">
                        <Row type="flex" justify="center">
                            <Col span={1}><a className="prev" hidden={!this.state.showPrev}
                                             onClick={this.slidePrev.bind(this)}>&#10094;</a></Col>
                            {this.state.curiosityDisplayData.map((cData, i) => {
                                return (<Col span={5}>
                                    <Card
                                        hoverable
                                        style={{width: 240}}
                                        cover={<img className="cardImg" alt="Curiosity"
                                                    src={cData.img_src}/>}
                                    >
                                        <Meta
                                            description={moment(cData.earth_date).format('MMMM DD YYYY')}
                                        /></Card>
                                </Col>)
                            })}
                            <Col span={1}> <a className="next" hidden={!this.state.showNext}
                                              onClick={this.slideNext.bind(this)}>&#10095;</a></Col>
                        </Row>
                    </div>
                    <h2 className="cameraTitle">Opportunity: Panoramic Camera
                    </h2>
                    <div className="cameraSelect">
                        <Select showSearch defaultValue="Camera Name" style={{width: 320, fontWeight: 'bold'}}
                                onSelect={this.handleChange.bind(this, 'Opportunity')}>
                            <Option value="FHAZ">Front Hazard Avoidance Camera</Option>
                            <Option value="RHAZ">Rear Hazard Avoidance Camera</Option>
                            <Option value="NAVCAM">Navigation Camera</Option>
                            <Option value="PANCAM">Panoramic Camera</Option>
                            <Option value="MINITES">Miniature Thermal Emission Spectrometer
                                (Mini-TES)</Option>
                        </Select>
                    </div>
                    <div className="container">
                        <Row type="flex" justify="center">
                            <Col span={1}><a className="prev" hidden={!this.state.showPrevOpp}
                                             onClick={this.slidePrevOpp.bind(this)}>&#10094;</a></Col>
                            {this.state.opportunityDisplayData.map((cData, i) => {
                                return (<Col span={5}>
                                    <Card
                                        hoverable
                                        style={{width: 240}}
                                        cover={<img className="cardImg" alt="Curiosity"
                                                    src={cData.img_src}/>}
                                    >
                                        <Meta
                                            description={moment(cData.earth_date).format('MMMM DD YYYY')}
                                        /></Card>
                                </Col>)
                            })}
                            <Col span={1}> <a className="next" hidden={!this.state.showNextOpp}
                                              onClick={this.slideNextOpp.bind(this)}>&#10095;</a></Col>
                        </Row>
                    </div>
                </Content>
            </div>
        );
    }

    getDateValue(type) {
        //let d = new Date();
        let d = this.state.earthDate != '' ? new Date(this.state.earthDate) : new Date();
        d.setDate(d.getDate() - 1);
        let datestring = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        if (type === 'Date') {
            return (
                moment(d).format('MMMM DD YYYY')
            );
        } else {
            return datestring;
        }
    }

    selectDayImage() {
        let curiosityRandom = this.state.galleryCuriosityData.length > 0 ? this.getRandomInt(this.state.galleryCuriosityData.length) : -1;
        let opportunityRandom = this.state.galleryOpportunityData.length > 0 ? this.getRandomInt(this.state.galleryOpportunityData.length) : -1;
        if (curiosityRandom > -1 && opportunityRandom > -1) {
            if (this.getRandomInt(2) === 1)
                opportunityRandom = -1;
            else
                curiosityRandom = -1;
        }
        if (opportunityRandom >= 0) {
            this.setState({
                dayImage: this.state.galleryOpportunityData[opportunityRandom],
            })
        }
        else if (curiosityRandom >= 0) {
            this.setState({
                dayImage: this.state.galleryCuriosityData[curiosityRandom],
            })
        } else {
            this.setState({
                dayImage: {
                    img_src: emptyImage,
                    camera: {
                        name: '',
                    },
                    rover: {
                        name: '',
                    }
                }
            })
        }
    }

    componentDidMount() {
        let datestring = this.getDateValue('String');
        let queryOpportunityUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?earth_date=" + datestring + "&api_key=" + apiKey;
        fetch(queryOpportunityUrl).then(res => res.json()).then((result) => {
            this.setState({
                galleryOpportunityData: result.photos,
                opportunityDisplayData: result.photos.slice(0, 4),
                showPrev: false,
                showNext: result.photos.length >= 4 ? true : false,
            })
            let queryCuriousityUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=" + datestring + "&api_key=" + apiKey;
            fetch(queryCuriousityUrl).then(res => res.json()).then((result) => {
                this.setState({
                    galleryCuriosityData: result.photos,
                    curiosityDisplayData: result.photos.slice(0, 4),
                    showPrevOpp: false,
                    showNextOpp: result.photos.length >= 4 ? true : false,
                })
                this.selectDayImage();
            })
        })
    }
}

export default App;