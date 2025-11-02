// Steam Events Calendar API - Cloudflare Worker
// Dữ liệu từ: https://partner.steamgames.com/doc/marketing/upcoming_events
// Deploy: wrangler deploy

export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);
      const format = url.searchParams.get('format') || 'json';
      const status = url.searchParams.get('status') || 'all'; // all, upcoming, ongoing, past
      const type = url.searchParams.get('type') || 'all'; // all, seasonal, fest, nextfest
      const notifications = url.searchParams.get('notifications') === 'true'; // Chỉ lấy events có thông báo

      const currentDate = new Date();
      
      // Lịch trình sự kiện Steam CHÍNH THỨC từ Steam Partner
      const steamEvents = [
        // === 2025 SEASONAL SALES ===
        {
          name: 'Steam Autumn Sale',
          type: 'Seasonal Sale',
          startDate: '2025-09-29',
          endDate: '2025-10-06',
          description: 'Đợt giảm giá mùa thu toàn Steam - game phát hành từ 30 ngày trước có thể tham gia',
          icon: '🍂',
          eligibility: 'Games released at least 30 days before event',
          category: 'seasonal'
        },
        {
          name: 'Steam Winter Sale',
          type: 'Seasonal Sale',
          startDate: '2025-12-18',
          endDate: '2026-01-05',
          description: 'Đợt giảm giá mùa đông lớn nhất năm - cuối năm 2025',
          icon: '❄️',
          eligibility: 'Games released at least 30 days before event',
          category: 'seasonal'
        },
        
        // === 2026 SEASONAL SALES ===
        {
          name: 'Steam Spring Sale',
          type: 'Seasonal Sale',
          startDate: '2026-03-19',
          endDate: '2026-03-26',
          description: 'Đợt giảm giá mùa xuân 2026',
          icon: '🌸',
          eligibility: 'Games released at least 30 days before event',
          category: 'seasonal'
        },

        // === 2025 THEMED FESTS ===
        {
          name: 'Real-Time Strategy Fest',
          type: 'Themed Fest',
          startDate: '2025-01-20',
          endDate: '2025-01-27',
          description: 'Lễ hội game chiến thuật thời gian thực',
          icon: '⚔️',
          eligibility: 'RTS games with demos, discounts, or Coming Soon',
          category: 'fest'
        },
        {
          name: 'Idler Fest',
          type: 'Themed Fest',
          startDate: '2025-02-03',
          endDate: '2025-02-10',
          description: 'Lễ hội game idle/clicker',
          icon: '🖱️',
          eligibility: 'Idle/incremental games',
          category: 'fest'
        },
        {
          name: 'Couch Co-Op Fest',
          type: 'Themed Fest',
          startDate: '2025-02-10',
          endDate: '2025-02-17',
          description: 'Lễ hội game chơi cùng nhau local co-op',
          icon: '🎮',
          eligibility: 'Local co-op games',
          category: 'fest'
        },
        {
          name: 'Visual Novel Fest',
          type: 'Themed Fest',
          startDate: '2025-03-03',
          endDate: '2025-03-10',
          description: 'Lễ hội visual novel',
          icon: '📖',
          eligibility: 'Visual novel games',
          category: 'fest'
        },
        {
          name: 'City Builder & Colony Sim Fest',
          type: 'Themed Fest',
          startDate: '2025-03-24',
          endDate: '2025-03-31',
          description: 'Lễ hội game xây dựng thành phố và mô phỏng thuộc địa',
          icon: '🏙️',
          eligibility: 'City building and colony simulation games',
          category: 'fest'
        },
        {
          name: 'Box-Pushing Fest',
          type: 'Themed Fest',
          startDate: '2025-04-21',
          endDate: '2025-04-28',
          description: 'Lễ hội game đẩy hộp và giải đố',
          icon: '📦',
          eligibility: 'Puzzle games with box-pushing mechanics',
          category: 'fest'
        },
        {
          name: 'Wargames Fest',
          type: 'Themed Fest',
          startDate: '2025-04-28',
          endDate: '2025-05-05',
          description: 'Lễ hội game chiến tranh',
          icon: '🪖',
          eligibility: 'Military strategy and wargames',
          category: 'fest'
        },
        {
          name: 'Creature Collector Fest',
          type: 'Themed Fest',
          startDate: '2025-05-12',
          endDate: '2025-05-19',
          description: 'Lễ hội game thu thập sinh vật',
          icon: '🐉',
          eligibility: 'Games with creature collecting mechanics',
          category: 'fest'
        },
        {
          name: 'Zombies vs. Vampires Fest',
          type: 'Themed Fest',
          startDate: '2025-05-26',
          endDate: '2025-06-02',
          description: 'Lễ hội game kinh dị với zombie và ma cà rồng',
          icon: '🧟',
          eligibility: 'Horror games featuring zombies or vampires',
          category: 'fest'
        },
        {
          name: 'Fishing Fest',
          type: 'Themed Fest',
          startDate: '2025-06-16',
          endDate: '2025-06-23',
          description: 'Lễ hội game câu cá',
          icon: '🎣',
          eligibility: 'Games with fishing mechanics',
          category: 'fest'
        },
        {
          name: 'Automation Fest',
          type: 'Themed Fest',
          startDate: '2025-07-14',
          endDate: '2025-07-21',
          description: 'Lễ hội game tự động hóa',
          icon: '⚙️',
          eligibility: 'Automation and factory building games',
          category: 'fest'
        },
        {
          name: 'Racing Fest',
          type: 'Themed Fest',
          startDate: '2025-07-28',
          endDate: '2025-08-04',
          description: 'Lễ hội game đua xe',
          icon: '🏎️',
          eligibility: 'Racing games',
          category: 'fest'
        },
        {
          name: '4X Fest',
          type: 'Themed Fest',
          startDate: '2025-08-11',
          endDate: '2025-08-18',
          description: 'Lễ hội game chiến lược 4X (eXplore, eXpand, eXploit, eXterminate)',
          icon: '🌍',
          eligibility: '4X strategy games',
          category: 'fest'
        },
        {
          name: 'TPS Fest (Third Person Shooter)',
          type: 'Themed Fest',
          startDate: '2025-08-25',
          endDate: '2025-09-01',
          description: 'Lễ hội game bắn súng góc nhìn thứ ba',
          icon: '🔫',
          eligibility: 'Third-person shooter games',
          category: 'fest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_third_person_shooters_2025'
        },
        {
          name: 'Political Sim Fest',
          type: 'Themed Fest',
          startDate: '2025-09-08',
          endDate: '2025-09-15',
          description: 'Lễ hội game mô phỏng chính trị',
          icon: '🏛️',
          eligibility: 'Games about politics and nation management',
          category: 'fest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_political_sim_2025'
        },
        {
          name: 'Steam Scream 4 Fest',
          type: 'Themed Fest',
          startDate: '2025-10-27',
          endDate: '2025-11-03',
          description: 'Lễ hội Halloween - game kinh dị',
          icon: '🎃',
          eligibility: 'Horror and spooky games',
          category: 'fest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_steam_halloween_2025'
        },
        {
          name: 'Animal Fest',
          type: 'Themed Fest',
          startDate: '2025-11-10',
          endDate: '2025-11-17',
          description: 'Lễ hội game về động vật',
          icon: '🐾',
          eligibility: 'Games about animals of all kinds',
          category: 'fest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_animal_2025'
        },
        {
          name: 'Sports Fest',
          type: 'Themed Fest',
          startDate: '2025-12-08',
          endDate: '2025-12-15',
          description: 'Lễ hội game thể thao - từ thi đấu đến quản lý đội',
          icon: '⚽',
          eligibility: 'Sports games - competing or managing teams',
          category: 'fest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_sports_2025'
        },

        // === STEAM NEXT FEST ===
        {
          name: 'Steam Next Fest - October 2025',
          type: 'Next Fest',
          startDate: '2025-10-13',
          endDate: '2025-10-20',
          description: 'Trải nghiệm demo game sắp ra mắt, chat với dev, xem livestream',
          icon: '🆕',
          eligibility: 'Upcoming unreleased games with playable demo',
          category: 'nextfest',
          registrationUrl: 'https://partner.steamgames.com/optin/sale/sale_nextfest_oct_2025'
        },
        {
          name: 'Steam Next Fest - February 2026',
          type: 'Next Fest',
          startDate: '2026-02-23',
          endDate: '2026-03-02',
          description: 'Trải nghiệm demo game sắp ra mắt, chat với dev, xem livestream',
          icon: '🆕',
          eligibility: 'Upcoming unreleased games with playable demo',
          category: 'nextfest',
          registrationUrl: 'https://partner.steamgames.com/optin/admin/edit/sale_nextfest_february_2026'
        }
      ];

      // Xử lý và phân loại events
      const processedEvents = steamEvents.map(event => {
        const start = new Date(event.startDate);
        const end = new Date(event.endDate);
        
        let eventStatus = 'upcoming';
        let daysUntil = null;
        let daysLeft = null;
        let weekWarning = false;
        let notificationLevel = null;
        
        if (currentDate < start) {
          eventStatus = 'upcoming';
          daysUntil = Math.ceil((start - currentDate) / (1000 * 60 * 60 * 24));
          
          // Thông báo cảnh báo theo mức độ
          if (daysUntil <= 1) {
            weekWarning = true;
            notificationLevel = 'critical'; // Sắp bắt đầu ngay
          } else if (daysUntil <= 3) {
            weekWarning = true;
            notificationLevel = 'high'; // Còn 3 ngày
          } else if (daysUntil <= 7) {
            weekWarning = true;
            notificationLevel = 'medium'; // Còn 1 tuần
          } else if (daysUntil <= 14) {
            notificationLevel = 'low'; // Còn 2 tuần
          }
        } else if (currentDate >= start && currentDate <= end) {
          eventStatus = 'ongoing';
          daysLeft = Math.ceil((end - currentDate) / (1000 * 60 * 60 * 24));
          notificationLevel = 'active';
        } else {
          eventStatus = 'past';
        }

        return {
          ...event,
          status: eventStatus,
          daysUntil,
          daysLeft,
          weekWarning,
          notificationLevel,
          duration: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1,
          steamUrl: 'https://store.steampowered.com/',
          sourceUrl: 'https://partner.steamgames.com/doc/marketing/upcoming_events'
        };
      });

      // Lọc theo status
      let filteredEvents = processedEvents;
      if (status !== 'all') {
        filteredEvents = filteredEvents.filter(e => e.status === status);
      }
      
      // Lọc theo type
      if (type !== 'all') {
        filteredEvents = filteredEvents.filter(e => e.category === type);
      }
      
      // Lọc theo notifications (chỉ lấy events có cảnh báo)
      if (notifications) {
        filteredEvents = filteredEvents.filter(e => e.weekWarning === true);
      }

      // Trả về theo format
      if (format === 'text') {
        const textOutput = formatAsText(filteredEvents, currentDate);
        return new Response(textOutput, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }

      // JSON response
      const jsonOutput = {
        success: true,
        timestamp: currentDate.toISOString(),
        currentDate: currentDate.toISOString().split('T')[0],
        totalEvents: filteredEvents.length,
        source: 'https://partner.steamgames.com/doc/marketing/upcoming_events',
        notifications: {
          critical: processedEvents.filter(e => e.notificationLevel === 'critical').length,
          high: processedEvents.filter(e => e.notificationLevel === 'high').length,
          medium: processedEvents.filter(e => e.notificationLevel === 'medium').length,
          low: processedEvents.filter(e => e.notificationLevel === 'low').length,
          active: processedEvents.filter(e => e.notificationLevel === 'active').length
        },
        summary: {
          ongoing: processedEvents.filter(e => e.status === 'ongoing').length,
          upcoming: processedEvents.filter(e => e.status === 'upcoming').length,
          past: processedEvents.filter(e => e.status === 'past').length,
          weekWarning: processedEvents.filter(e => e.weekWarning === true).length,
          byType: {
            seasonal: processedEvents.filter(e => e.category === 'seasonal').length,
            fest: processedEvents.filter(e => e.category === 'fest').length,
            nextfest: processedEvents.filter(e => e.category === 'nextfest').length
          }
        },
        events: filteredEvents
      };

      return new Response(JSON.stringify(jsonOutput, null, 2), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=3600'
        }
      });

    } catch (error) {
      const errorResponse = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(errorResponse, null, 2), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }
  }
};

function formatAsText(events, currentDate) {
  let output = '╔' + '═'.repeat(78) + '╗\n';
  output += '║' + ' '.repeat(20) + 'STEAM EVENTS CALENDAR 2025-2026' + ' '.repeat(27) + '║\n';
  output += '║' + ' '.repeat(15) + 'Source: partner.steamgames.com/doc/marketing' + ' '.repeat(20) + '║\n';
  output += '╚' + '═'.repeat(78) + '╝\n\n';
  output += `📅 Current Date: ${currentDate.toISOString().split('T')[0]}\n\n`;

  const ongoing = events.filter(e => e.status === 'ongoing');
  const upcoming = events.filter(e => e.status === 'upcoming');
  const past = events.filter(e => e.status === 'past');

  if (ongoing.length > 0) {
    output += '🔴 ĐANG DIỄN RA\n';
    output += '═'.repeat(80) + '\n';
    ongoing.forEach(event => {
      output += `${event.icon} ${event.name}\n`;
      output += `   📆 ${event.startDate} → ${event.endDate}\n`;
      output += `   ⏰ Còn lại: ${event.daysLeft} ngày (${event.duration} ngày)\n`;
      output += `   🔔 Notification: ${event.notificationLevel.toUpperCase()}\n`;
      output += `   📝 ${event.description}\n`;
      output += `   🏷️  ${event.type} | 🎯 ${event.eligibility}\n`;
      if (event.registrationUrl) {
        output += `   📋 Registration: ${event.registrationUrl}\n`;
      }
      output += '\n';
    });
  }

  if (upcoming.length > 0) {
    output += '\n🟢 SẮP DIỄN RA\n';
    output += '═'.repeat(80) + '\n';
    upcoming.forEach(event => {
      const warningIcon = event.weekWarning ? '⚠️ ' : '';
      const notifText = event.notificationLevel ? ` | 🔔 ${event.notificationLevel.toUpperCase()}` : '';
      
      output += `${warningIcon}${event.icon} ${event.name}\n`;
      output += `   📆 ${event.startDate} → ${event.endDate}\n`;
      output += `   ⏳ Bắt đầu sau: ${event.daysUntil} ngày (${event.duration} ngày)${notifText}\n`;
      
      if (event.weekWarning) {
        if (event.notificationLevel === 'critical') {
          output += `   🚨 CẢNH BÁO: Sự kiện bắt đầu trong vòng 24 giờ!\n`;
        } else if (event.notificationLevel === 'high') {
          output += `   ⚠️  CẢNH BÁO: Còn 3 ngày nữa!\n`;
        } else if (event.notificationLevel === 'medium') {
          output += `   📢 THÔNG BÁO: Còn 1 tuần nữa!\n`;
        }
      } else if (event.notificationLevel === 'low') {
        output += `   💡 Ghi chú: Còn 2 tuần\n`;
      }
      
      output += `   📝 ${event.description}\n`;
      output += `   🏷️  ${event.type} | 🎯 ${event.eligibility}\n`;
      if (event.registrationUrl) {
        output += `   📋 Registration: ${event.registrationUrl}\n`;
      }
      output += '\n';
    });
  }

  if (past.length > 0) {
    output += '\n⚫ ĐÃ KẾT THÚC\n';
    output += '═'.repeat(80) + '\n';
    past.forEach(event => {
      output += `${event.icon} ${event.name}\n`;
      output += `   📆 ${event.startDate} - ${event.endDate} | 🏷️  ${event.type}\n`;
    });
    output += '\n';
  }

  output += `${'─'.repeat(80)}\n`;
  output += `📊 THỐNG KÊ\n`;
  output += `   Tổng số sự kiện: ${events.length}\n`;
  output += `   🔴 Đang diễn ra: ${ongoing.length} | 🟢 Sắp tới: ${upcoming.length} | ⚫ Đã qua: ${past.length}\n`;
  const weekWarningCount = events.filter(e => e.weekWarning).length;
  if (weekWarningCount > 0) {
    output += `   ⚠️  Cần chú ý (trong vòng 1 tuần): ${weekWarningCount} sự kiện\n`;
  }
  output += `\n🔄 Cập nhật: ${currentDate.toISOString()}\n`;
  output += `🌐 Steam Store: https://store.steampowered.com/\n`;
  output += `📚 Documentation: https://partner.steamgames.com/doc/marketing/upcoming_events\n`;

  return output;
}