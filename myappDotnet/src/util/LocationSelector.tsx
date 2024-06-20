import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface City {
    Id: string;
    Name: string;
    Districts: District[];
}

interface District {
    Id: string;
    Name: string;
    Wards: Ward[];
}

interface Ward {
    Id: string;
    Name: string;
}
interface LocationSelectorProps {
    onAddressChange: (address: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onAddressChange }) => {
    const [data, setData] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [cities, setCities] = useState<{ name: string; id: string }[]>([]);
    const [districts, setDistricts] = useState<{ name: string; id: string }[]>([]);
    const [wards, setWards] = useState<{ name: string; id: string }[]>([]);
    const [address, setAddress] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get<City[]>("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
            setData(response.data);
            setCities(response.data.map(city => ({ name: city.Name, id: city.Id })));
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            const city = data.find(city => city.Id === selectedCity);
            if (city) {
                setDistricts(city.Districts.map(district => ({ name: district.Name, id: district.Id })));
                setWards([]);
                setSelectedDistrict('');
                setSelectedWard('');
                setAddress(city.Name);
                onAddressChange(city.Name);

            }
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict('');
            setSelectedWard('');
            setAddress('');
        }
    }, [selectedCity, data, onAddressChange]);

    useEffect(() => {
        if (selectedDistrict && selectedCity) {
            const city = data.find(city => city.Id === selectedCity);
            const district = city?.Districts.find(district => district.Id === selectedDistrict);
            if (district) {
                setWards(district.Wards.map(ward => ({ name: ward.Name, id: ward.Id })));
                setSelectedWard('');
                setAddress(`${city?.Name}, ${district.Name}`);
                onAddressChange(`${city?.Name}, ${district.Name}`);
            }
        } else {
            setWards([]);
            setSelectedWard('');

        }
    }, [selectedDistrict, selectedCity, data, onAddressChange]);

    useEffect(() => {
        if (selectedWard && selectedDistrict && selectedCity) {
            const city = data.find(city => city.Id === selectedCity);
            const district = city?.Districts.find(district => district.Id === selectedDistrict);
            const ward = district?.Wards.find(ward => ward.Id === selectedWard);
            if (ward) {
                setAddress(`${city?.Name}, ${district?.Name}, ${ward.Name}`);
                onAddressChange(`${city?.Name}, ${district?.Name}, ${ward.Name}`);
            }
        }

    }, [selectedWard, selectedDistrict, selectedCity, data, onAddressChange]);






    return (
        <div className='row'>
            <div className="col-md-4">
                <select
                    className="form-select form-select-sm mb-3"
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    aria-label=".form-select-sm">
                    <option value="">Chọn tỉnh thành</option>
                    {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-md-4">
                <select
                    className="form-select form-select-sm mb-3"
                    value={selectedDistrict}
                    onChange={e => setSelectedDistrict(e.target.value)}
                    aria-label=".form-select-sm">
                    <option value="">Chọn quận huyện</option>
                    {districts.map(district => (
                        <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-md-4">
                <select
                    className="form-select form-select-sm"
                    value={selectedDistrict}
                    onChange={e => setSelectedWard(e.target.value)}
                    aria-label=".form-select-sm">
                    <option value="">Chọn phường xã</option>
                    {wards.map(ward => (
                        <option key={ward.id} value={ward.id}>{ward.name}</option>
                    ))}
                </select>
            </div>


        </div>
    );
}

export default LocationSelector;
