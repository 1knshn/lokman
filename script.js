document.addEventListener('DOMContentLoaded', function() {
    const girisFormu = document.getElementById('girisFormu');
    const edevletGiris = document.getElementById('edevletGiris');
    const kayitBtn = document.getElementById('kayitBtn');
    const sifremiUnuttumBtn = document.getElementById('sifremiUnuttumBtn');
    const kayitModal = document.getElementById('kayitModal');
    const sifremiUnuttumModal = document.getElementById('sifremiUnuttumModal');
    const kapatBtnler = document.getElementsByClassName('kapat');

    // Dalga efekti için fonksiyon
    function dalgaEfektiOlustur(e, btn) {
        const dalga = document.createElement('div');
        dalga.classList.add('dalga');
        
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        dalga.style.left = x + 'px';
        dalga.style.top = y + 'px';
        
        btn.appendChild(dalga);
        
        setTimeout(() => dalga.remove(), 600);
    }

    // Tüm butonlara dalga efekti ekle
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            dalgaEfektiOlustur(e, this);
        });
    });

    // Modal işlemleri
    kayitBtn.addEventListener('click', function() {
        kayitModal.style.display = 'block';
    });

    sifremiUnuttumBtn.addEventListener('click', function() {
        sifremiUnuttumModal.style.display = 'block';
    });

    // Kapatma butonları
    Array.from(kapatBtnler).forEach(btn => {
        btn.addEventListener('click', function() {
            kayitModal.style.display = 'none';
            sifremiUnuttumModal.style.display = 'none';
        });
    });

    // Modal dışına tıklandığında kapatma
    window.addEventListener('click', function(e) {
        if (e.target == kayitModal) {
            kayitModal.style.display = 'none';
        }
        if (e.target == sifremiUnuttumModal) {
            sifremiUnuttumModal.style.display = 'none';
        }
    });

    // TC Kimlik ve Telefon validasyonu
    document.getElementById('tc').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 11);
    });

    document.getElementById('telefon').addEventListener('input', function(e) {
        let num = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        if(num.length > 0) {
            num = num.match(new RegExp('.{1,3}', 'g')).join(' ');
        }
        this.value = num;
    });

    // Kayıt formu validasyonu güncelleme
    const kayitFormu = document.getElementById('kayitFormu');
    kayitFormu.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tc = document.getElementById('tc').value;
        const ad = document.getElementById('ad').value;
        const soyad = document.getElementById('soyad').value;
        const dogumTarihi = document.getElementById('dogumTarihi').value;
        const telefon = document.getElementById('telefon').value;
        const eposta = document.getElementById('kayitEposta').value;
        const sifre = document.getElementById('kayitSifre').value;
        const sifreTekrar = document.getElementById('sifreTekrar').value;
        const kvkk = document.getElementById('kvkk').checked;

        if (sifre !== sifreTekrar) {
            alert('Şifreler eşleşmiyor!');
            return;
        }

        if (!kvkk) {
            alert('KVKK şartlarını kabul etmelisiniz!');
            return;
        }

        if (tc.length !== 11) {
            alert('Geçerli bir TC Kimlik numarası giriniz!');
            return;
        }

        console.log('Kayıt denemesi:', {
            tc: tc,
            ad: ad,
            soyad: soyad,
            dogumTarihi: dogumTarihi,
            telefon: telefon,
            eposta: eposta
        });
    });

    // Şifremi unuttum formu işlemi
    const sifremiUnuttumFormu = document.getElementById('sifremiUnuttumFormu');
    sifremiUnuttumFormu.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eposta = document.getElementById('sifremiUnuttumEposta').value;
        console.log('Şifre sıfırlama isteği:', eposta);
    });

    // Normal giriş formu işlemi
    girisFormu.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eposta = document.getElementById('eposta').value;
        const sifre = document.getElementById('sifre').value;
        const beniHatirla = document.getElementById('beniHatirla').checked;

        // Burada giriş işlemleri yapılacak
        console.log('Giriş denemesi:', {
            eposta: eposta,
            sifre: sifre,
            beniHatirla: beniHatirla
        });
    });

    // e-Devlet ile giriş işlemi
    edevletGiris.addEventListener('click', function() {
        // e-Devlet test ortamı URL'i
        const eDevletUrl = 'https://giris.turkiye.gov.tr/Giris/gir';
        
        // Yeni pencerede aç
        window.open(eDevletUrl, '_blank');
    });

    // Aktif menü item'ını işaretle
    const currentLocation = window.location.pathname;
    const menuItems = document.querySelectorAll('nav ul li a');
    
    menuItems.forEach(item => {
        if(item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
        
        // Hover efekti için dalga animasyonu
        item.addEventListener('mouseenter', function(e) {
            const ripple = document.createElement('div');
            ripple.classList.add('menu-ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Menü için smooth scroll
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Link güvenliği için kontrol
    const links = document.querySelectorAll('.nav-btn');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Eğer href boş veya # ise tıklamayı engelle
            if (!this.getAttribute('href') || this.getAttribute('href') === '#') {
                e.preventDefault();
                return;
            }
            
            // Link tıklanma efekti
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Hastane verilerini tutacak array
    const hastaneler = [
        {
            id: 1,
            ad: "Ankara Şehir Hastanesi",
            sehir: "Ankara",
            adres: "Üniversiteler Mahallesi 1604. Cadde No: 9 Çankaya/Ankara",
            telefon: "0312 552 60 00",
            tip: "Devlet Hastanesi"
        },
        {
            id: 2,
            ad: "İstanbul Eğitim ve Araştırma Hastanesi",
            sehir: "İstanbul",
            adres: "Kasap İlyas Mah. Org. Abdurrahman Nafiz Gürman Cd. Samatya Fatih/İstanbul",
            telefon: "0212 459 60 00",
            tip: "Eğitim ve Araştırma Hastanesi"
        },
        // Daha fazla hastane eklenebilir
    ];

    // Hastane modalını aç
    document.querySelector('.nav-btn.harita').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('hastaneModal').style.display = 'block';
        hastaneleriListele(hastaneler);
    });

    // Modal kapatma
    document.querySelector('#hastaneModal .kapat').addEventListener('click', function() {
        document.getElementById('hastaneModal').style.display = 'none';
    });

    // Hastane arama fonksiyonu
    document.getElementById('hastaneArama').addEventListener('input', function(e) {
        const aramaMetni = e.target.value.toLowerCase();
        const secilenSehir = document.getElementById('sehirFiltre').value.toLowerCase();
        
        const filtrelenmisHastaneler = hastaneler.filter(hastane => {
            const sehirUygun = !secilenSehir || hastane.sehir.toLowerCase() === secilenSehir;
            const aramaUygun = hastane.ad.toLowerCase().includes(aramaMetni) || 
                              hastane.adres.toLowerCase().includes(aramaMetni);
            return sehirUygun && aramaUygun;
        });
        
        hastaneleriListele(filtrelenmisHastaneler);
    });

    // Şehir filtresi
    document.getElementById('sehirFiltre').addEventListener('change', function(e) {
        const aramaMetni = document.getElementById('hastaneArama').value.toLowerCase();
        const secilenSehir = e.target.value.toLowerCase();
        
        const filtrelenmisHastaneler = hastaneler.filter(hastane => {
            const sehirUygun = !secilenSehir || hastane.sehir.toLowerCase() === secilenSehir;
            const aramaUygun = hastane.ad.toLowerCase().includes(aramaMetni) || 
                              hastane.adres.toLowerCase().includes(aramaMetni);
            return sehirUygun && aramaUygun;
        });
        
        hastaneleriListele(filtrelenmisHastaneler);
    });

    // Hastaneleri listele
    function hastaneleriListele(hastaneListesi) {
        const container = document.getElementById('hastaneListesi');
        container.innerHTML = '';
        
        hastaneListesi.forEach(hastane => {
            const hastaneKart = document.createElement('div');
            hastaneKart.className = 'hastane-kart';
            hastaneKart.innerHTML = `
                <h3>${hastane.ad}</h3>
                <p><strong>Adres:</strong> ${hastane.adres}</p>
                <p><strong>Telefon:</strong> ${hastane.telefon}</p>
                <div class="hastane-detay">
                    <span>${hastane.tip}</span>
                    <button onclick="randevuAl(${hastane.id})">Randevu Al</button>
                </div>
            `;
            container.appendChild(hastaneKart);
        });
    }

    // Randevu alma fonksiyonu
    function randevuAl(hastaneId) {
        window.open('https://mhrs.gov.tr', '_blank');
    }
});
