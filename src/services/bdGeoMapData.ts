export interface GeoCoord { lat: number; lng: number; }

export const DIVISION_COORDS: Record<string, GeoCoord> = {
  '10': { lat: 23.7800, lng: 90.3493 }, // Barisal
  '20': { lat: 22.3595, lng: 91.8315 }, // Chittagong
  '30': { lat: 23.9333, lng: 90.1333 }, // Dhaka
  '40': { lat: 22.7036, lng: 90.3564 }, // Khulna
  '45': { lat: 24.7466, lng: 89.5294 }, // Rajshahi
  '50': { lat: 25.0337, lng: 89.0000 }, // Rangpur
  '55': { lat: 22.8344, lng: 91.1819 }, // Sylhet
  '60': { lat: 23.4607, lng: 89.1289 }, // Mymensingh
};

export const DISTRICT_COORDS: Record<string, GeoCoord> = {
  '04': { lat: 23.0478, lng: 91.0184 }, // Brahmanbaria
  '09': { lat: 23.4641, lng: 91.1760 }, // Chandpur
  '12': { lat: 23.4604, lng: 90.7734 }, // Comilla
  '13': { lat: 23.2855, lng: 91.6644 }, // Cox's Bazar
  '15': { lat: 22.6772, lng: 89.5143 }, // Feni
  '19': { lat: 22.3247, lng: 91.6168 }, // Khagrachhari
  '22': { lat: 22.8453, lng: 91.2067 }, // Lakshmipur
  '25': { lat: 23.1833, lng: 91.9000 }, // Noakhali
  '29': { lat: 22.4669, lng: 92.1719 }, // Rangamati
  '30': { lat: 22.2565, lng: 92.0648 }, // Bandarban
  '32': { lat: 22.5936, lng: 92.2135 }, // Chittagong
  '33': { lat: 23.2150, lng: 90.8850 }, // Cumilla (old Comilla)
  '35': { lat: 23.1410, lng: 90.1230 }, // Shariatpur
  '38': { lat: 23.3130, lng: 91.2020 }, // Chandpur (new)
  '40': { lat: 23.1630, lng: 90.8700 }, // Daudkandi
  '42': { lat: 23.5130, lng: 90.7850 }, // Debidwar
  '44': { lat: 23.4630, lng: 91.2090 }, // Homna
  '46': { lat: 23.6240, lng: 90.9430 }, // Muradnagar
  '47': { lat: 23.4390, lng: 91.0390 }, // Burichang
  '48': { lat: 24.3840, lng: 88.7010 }, // Chapai Nawabganj
  '50': { lat: 23.1270, lng: 89.2220 }, // Jashore (Jessore)
  '52': { lat: 22.8500, lng: 89.4660 }, // Khulna
  '54': { lat: 23.3280, lng: 88.6000 }, // Chuadanga
  '55': { lat: 23.2130, lng: 89.4560 }, // Jhenaidah
  '56': { lat: 23.6490, lng: 88.8430 }, // Kushita
  '57': { lat: 23.6100, lng: 89.8310 }, // Magura
  '58': { lat: 23.1660, lng: 89.2100 }, // Meherpur
  '59': { lat: 24.3580, lng: 88.6280 }, // Murshidabad
  '60': { lat: 24.2020, lng: 89.1480 }, // Naogaon
  '61': { lat: 23.9010, lng: 89.1220 }, // Narail
  '62': { lat: 23.9170, lng: 89.5290 }, // Pabna
  '64': { lat: 23.4580, lng: 89.3110 }, // Sathkira
  '65': { lat: 25.2200, lng: 89.4230 }, // Bogura
  '66': { lat: 24.9350, lng: 89.7130 }, // Jamalpur
  '67': { lat: 24.4080, lng: 88.0290 }, // Joypurhat
  '68': { lat: 24.8700, lng: 88.9200 }, // Nawabganj
  '69': { lat: 25.7150, lng: 89.2730 }, // Nilphamari
  '71': { lat: 24.6370, lng: 88.6490 }, // Natore
  '72': { lat: 24.0200, lng: 89.1250 }, // Rajbari
  '73': { lat: 24.3740, lng: 89.4170 }, // Sirajganj
  '74': { lat: 23.8550, lng: 89.2330 }, // Faridpur
  '75': { lat: 23.6470, lng: 90.1520 }, // Gopalganj
  '76': { lat: 23.5510, lng: 89.7820 }, // Madaripur
  '77': { lat: 23.6210, lng: 90.5070 }, // Munshiganj
  '78': { lat: 24.1870, lng: 90.4410 }, // Narsingdi
  '79': { lat: 23.4460, lng: 89.6050 }, // Shariatpur (new)
  '81': { lat: 23.7030, lng: 91.7190 }, // Bandarban (new)
  '82': { lat: 25.5530, lng: 89.2240 }, // Gaibandha
  '83': { lat: 25.6320, lng: 89.6650 }, // Kurigram
  '84': { lat: 25.9350, lng: 89.5230 }, // Lalmonirhat
  '85': { lat: 25.7330, lng: 89.2080 }, // Rangpur
  '86': { lat: 26.0770, lng: 88.2420 }, // Thakurgaon
  '87': { lat: 25.9320, lng: 88.5550 }, // Panchagarh
  '88': { lat: 24.6580, lng: 90.3340 }, // Netrokona
  '89': { lat: 25.1070, lng: 89.8770 }, // Sherpur
  '90': { lat: 24.7560, lng: 91.6850 }, // Sunamganj
  '91': { lat: 24.8980, lng: 91.8700 }, // Sylhet
  '92': { lat: 24.3730, lng: 91.4140 }, // Habiganj
  '93': { lat: 24.7310, lng: 91.8940 }, // Moulvibazar
  '94': { lat: 23.9140, lng: 91.1270 }, // Feni (new)
  '95': { lat: 23.1830, lng: 90.1920 }, // Bagerhat
  '96': { lat: 22.6250, lng: 91.9490 }, // Chittagong (new)
  '97': { lat: 25.3710, lng: 88.5740 }, // Dinajpur
  '98': { lat: 24.2670, lng: 89.6730 }, // Tangail
  '99': { lat: 23.5950, lng: 90.4200 }, // Dhaka
};

export function getDivisionCoord(code: string): GeoCoord {
  return DIVISION_COORDS[code] || { lat: 23.6850, lng: 90.3563 };
}

export function getDistrictCoord(code: string): GeoCoord {
  return DISTRICT_COORDS[code] || { lat: 23.6850, lng: 90.3563 };
}
