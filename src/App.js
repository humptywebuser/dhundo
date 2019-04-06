import React, { PureComponent } from 'react';
import './App.scss';
import Header from "./components/Header/Header";

class App extends PureComponent {	
	constructor(props) {
		super(props);
		this.suggs = {};	
		this.pos = {
			lat : 28.397063000000003,
			lng : 77.0733314
		}
	}

	componentDidMount(){
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.pos.lat = position.coords.latitude;
				this.pos.long = position.coords.long;
				this.renderMap();
			}, () => {
				this.renderMap();
			});
		}else{
			this.renderMap();
		}
	}

	renderMap(){
		const goog = window.google;

		this.map = new goog.maps.Map(this.mapEle, {
			center: this.pos,
			zoom: 13
		});
		
		this.map.controls[goog.maps.ControlPosition.TOP_CENTER].push(this.container);

		this.autocomplete = new goog.maps.places.Autocomplete(this.searchbox);
		this.autocomplete.bindTo('bounds', this.map);

		this.infoWindow = new goog.maps.InfoWindow();
        this.infoWindow.setContent(this.infoContainer);
		
		this.marker = new goog.maps.Marker({
          map: this.map,
          anchorPoint: new goog.maps.Point(0, -29)
        });
		
		this.addEventListener()

	}

	addEventListener = (map,autocomplete,marker) => {
		this.autocomplete.addListener('place_changed', () => {
			this.infoWindow.close();
			this.marker.setVisible(false);
			var place = this.autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}
	
			if (place.geometry.viewport) {
				this.map.fitBounds(place.geometry.viewport);
			} else {
				this.map.setCenter(place.geometry.location);
				this.map.setZoom(17);
			}
			this.marker.setPosition(place.geometry.location);
			this.marker.setVisible(true);
	
			var address = '';
			if (place.address_components) {
				address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}
	
			this.infoContainer.children['place-name'].textContent = place.name;
			this.infoContainer.children['place-address'].textContent = address;
			this.infoWindow.open(this.map, this.marker);
		});
	}

	render(){
		return (
			<div className="App">
				<Header />
				<section id='autocomplete' ref={container => this.container = container}>
					<div id='searchbox'>
						<input type="text" ref={searchbox => this.searchbox = searchbox}
							placeholder="Search for places"
							autoFocus
						/>
						<i className="search-icon"></i>
					</div>
				</section>
				<div id='map' ref={map => this.mapEle = map}></div>
				<div id="infowindow-content" ref={infoContainer => this.infoContainer = infoContainer}>
					<span id="place-name"  className="title"></span><br/>
					<span id="place-address"></span>
				</div>
			</div>
		);
	}
}

export default App;
