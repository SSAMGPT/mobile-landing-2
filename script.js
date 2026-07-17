// script.js
// 커스텀 스크립트가 필요한 경우 여기에 추가합니다.

document.addEventListener('DOMContentLoaded', () => {
    const callBtn = document.getElementById('call-btn');
    const formModal = document.getElementById('form-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // 모달 열기 및 초기화
    if (callBtn && formModal) {
        callBtn.addEventListener('click', () => {
            // 팝업 초기화 로직
            const inputs = formModal.querySelectorAll('.modal-input');
            inputs.forEach(input => input.value = '');
            
            const checkbox = formModal.querySelector('.terms-checkbox');
            if (checkbox) checkbox.checked = false;

            const submitBtn = formModal.querySelector('.modal-submit-btn');
            if (submitBtn) {
                submitBtn.innerHTML = '신청하기';
                submitBtn.style.backgroundColor = ''; // 원래 색상으로 복구
                submitBtn.style.cursor = 'pointer';
                submitBtn.classList.remove('submitted');
                submitBtn.disabled = false;
            }

            formModal.classList.add('active');
        });
    }

    // 모달 닫기 (X 버튼)
    if (modalCloseBtn && formModal) {
        modalCloseBtn.addEventListener('click', () => {
            formModal.classList.remove('active');
        });
    }

    // 모달 바깥 배경 클릭 시 닫기
    if (formModal) {
        formModal.addEventListener('click', (e) => {
            if (e.target === formModal) {
                formModal.classList.remove('active');
            }
        });
    }

    // 두 번째 팝업 관련 요소
    const successModal = document.getElementById('success-modal');
    const successCloseBtn = document.getElementById('success-close-btn');

    // 신청하기 버튼 클릭 시 상태 변경 및 두 번째 팝업 띄우기
    const submitBtn = document.querySelector('.modal-submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            submitBtn.innerHTML = `
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <span>신청 완료</span>
            `;
            submitBtn.style.backgroundColor = '#4CAF50'; // 성공 초록색
            submitBtn.style.cursor = 'default';
            submitBtn.classList.add('submitted');
            submitBtn.disabled = true;

            // 1초 후 두 번째 팝업 띄우기
            setTimeout(() => {
                formModal.classList.remove('active'); // 첫 번째 팝업 닫기
                if (successModal) {
                    successModal.classList.add('active'); // 두 번째 팝업 열기
                }
            }, 1000);
        });
    }

    // 두 번째 팝업 닫기 (하단 버튼)
    if (successCloseBtn && successModal) {
        successCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('active');
        });
    }

    // 두 번째 팝업 바깥 배경 클릭 시 닫기
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });
    }

    // --- 애플 액티비티 링 (도넛 차트) 로직 ---
    const activities = [
        { label: "장례절차나 의식에 대한 조언", value: 35.9, color: "#FF4B72", size: 240 }, // 1위 (너무 붉지 않게 부드러운 핑크-레드로 조정)
        { label: "장례 후 가족간 상속절차", value: 20.5, color: "#ffffff", size: 200 }, // 2위 화이트
        { label: "행정절차 (사망신고)", value: 15.2, color: "#999999", size: 160 }, // 3위 다시 그레이로 원복
        { label: "안치장소 결정", value: 14.8, color: "#04C7DD", size: 120 },
        { label: "조문객 접객 지원", value: 13.6, color: "#5856D6", size: 80 },
    ];

    const ringsWrapper = document.getElementById('rings-wrapper');
    const legendWrapper = document.getElementById('legend-wrapper');
    const chartFootnotes = document.getElementById('chart-footnotes');
    const activityChart = document.getElementById('activity-chart');

    if (ringsWrapper && legendWrapper && activityChart) {
        const topActivities = activities.slice(0, 3);
        const otherActivities = activities.slice(3);
        
        // 화면 크기에 따른 반응형 사이즈 결정 (가장 최적화된 최소 크기로 아주 조금 더 축소)
        const isSmallScreen = window.innerWidth <= 380;
        const strokeWidth = isSmallScreen ? 8 : 9; 
        const baseSizes = isSmallScreen ? [118, 92, 66] : [126, 98, 70];
        
        ringsWrapper.style.width = `${baseSizes[0]}px`;
        ringsWrapper.style.height = `${baseSizes[0]}px`;

        // 상위 3개 렌더링
        topActivities.forEach((data, index) => {
            const size = baseSizes[index];
            const radius = (size - strokeWidth) / 2;
            const circumference = radius * 2 * Math.PI;
            
            const gradientId = `gradient-ring-${index}`;
            let secondaryColor = data.color;
            // 도넛 컬러가 연해지지 않도록 그라데이션 제거 (숫자 컬러와 100% 동일하게 적용)
            // if (index === 0) secondaryColor = "#FF829D"; 
            // if (index === 1) secondaryColor = "#e0e0e0"; 
            // if (index === 2) secondaryColor = "#bbbbbb"; 

            // 1. Ring SVG 생성 (정중앙 배치)
            const ringHtml = `
                <div class="ring-item" id="ring-item-${index}" style="width:${size}px; height:${size}px;">
                    <svg class="ring-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                        <defs>
                            <linearGradient id="${gradientId}" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stop-color="${data.color}" />
                                <stop offset="100%" stop-color="${secondaryColor}" />
                            </linearGradient>
                        </defs>
                        <circle class="ring-track" cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke-width="${strokeWidth}"></circle>
                        <circle class="ring-progress" id="ring-progress-${index}" cx="${size/2}" cy="${size/2}" r="${radius}" fill="none" stroke="url(#${gradientId})" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}"></circle>
                    </svg>
                </div>
            `;
            ringsWrapper.insertAdjacentHTML('beforeend', ringHtml);

            // 2. Legend 생성
            let labelColorStyle = '';
            if (index === 0) labelColorStyle = 'style="color: #ffffff;"'; // 다시 화이트로 원복
            else if (index === 1) labelColorStyle = 'style="color: #e2e2e2;"';

            const legendHtml = `
                <div class="legend-item">
                    <span class="legend-label" ${labelColorStyle}>${data.label}</span>
                    <span class="legend-value" style="color: ${data.color}">${data.value}<span class="legend-unit">%</span></span>
                </div>
            `;
            legendWrapper.insertAdjacentHTML('beforeend', legendHtml);
        });

        // 나머지 하위 데이터 각주 렌더링
        if (chartFootnotes) {
            otherActivities.forEach(data => {
                const footnoteHtml = `
                    <div class="footnote-item">
                        <span class="footnote-label">· ${data.label}</span>
                        <span class="footnote-value">${data.value}%</span>
                    </div>
                `;
                chartFootnotes.insertAdjacentHTML('beforeend', footnoteHtml);
            });
        }

        // 화면에 보일 때 애니메이션 실행
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    legendWrapper.classList.add('visible');
                    if (chartFootnotes) chartFootnotes.classList.add('visible');
                    
                    topActivities.forEach((data, index) => {
                        setTimeout(() => {
                            const ringItem = document.getElementById(`ring-item-${index}`);
                            if (ringItem) ringItem.classList.add('visible');
                            
                            const progressCircle = document.getElementById(`ring-progress-${index}`);
                            if (progressCircle) {
                                const size = baseSizes[index];
                                const radius = (size - strokeWidth) / 2;
                                const circumference = radius * 2 * Math.PI;
                                const progressOffset = ((100 - data.value) / 100) * circumference;
                                progressCircle.style.strokeDashoffset = progressOffset;
                            }
                        }, index * 150); // 순차적 딜레이
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(activityChart);
    }

    // --- 가로 프로그레스 바 애니메이션 ---
    const progressBars = document.querySelector('.progress-bar-container');
    if (progressBars) {
        const pbObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    pbObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        pbObserver.observe(progressBars);
    }

    // --- 화이트 프레임 단일 도넛 차트 애니메이션 ---
    const wfChart = document.querySelector('.wf-chart-content');
    if (wfChart) {
        const wfObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        wfChart.classList.add('visible');
                    }, 200); // 0.2초 딜레이 후 애니메이션 시작
                    wfObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        wfObserver.observe(wfChart);
    }

    // --- 별점 애니메이션 자동 재생 (화면에 보일 때) ---
    const starWrapper = document.getElementById('star-rating-wrapper');
    if (starWrapper) {
        const starObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 화면에 보이면 클래스 추가하여 애니메이션 트리거
                    setTimeout(() => {
                        starWrapper.classList.add('animate');
                    }, 300);
                    starObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        starObserver.observe(starWrapper);
    }

    // --- 맺음말 손 이미지 스크롤 애니메이션 ---
    const closingImage = document.getElementById('adjustable-image');
    if (closingImage) {
        const closingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    closingImage.classList.add('animate');
                    closingObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        closingObserver.observe(closingImage);
    }
});


