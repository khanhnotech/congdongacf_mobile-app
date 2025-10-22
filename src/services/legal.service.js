const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

const legalDocs = [
  {
    id: 'legal-1',
    title: 'Quy chế hoạt động cộng đồng',
    description: 'Những nguyên tắc cần tuân thủ khi tham gia ACF.',
    publishedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'legal-2',
    title: 'Quy định bảo vệ dữ liệu cá nhân',
    description: 'Chính sách về quyền riêng tư và bảo vệ dữ liệu.',
    publishedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'legal-3',
    title: 'Thỏa thuận cung cấp và sử dụng dịch vụ - TRUNGTAMACF.VN',
    description: 'Điều khoản và điều kiện sử dụng dịch vụ cộng đồng TRUNGTAMACF.VN.',
    publishedAt: '2025-01-20T00:00:00Z',
    content: `I. Quy định chung
TRUNGTAMACF.VN là cộng đồng trực tuyến hoạt động hợp pháp theo quy định pháp luật Việt Nam. Khi đăng ký và sử dụng dịch vụ, Người tham gia mặc nhiên đồng ý toàn bộ các điều khoản tại thỏa thuận này.

II. Quyền và nghĩa vụ của Người tham gia
Được quyền tạo tài khoản, chia sẻ thông tin, bình luận và thảo luận theo quy định.
Cung cấp thông tin chính xác, chịu trách nhiệm về toàn bộ nội dung đã đăng tải trong cộng đồng.
Không đăng tải các nội dung vi phạm pháp luật: tin giả, chống phá Nhà nước, bạo lực, khiêu dâm, mê tín, vi phạm quyền sở hữu trí tuệ.
Bảo mật tài khoản, không chia sẻ mật khẩu cho bên thứ ba.

III. Quyền và nghĩa vụ của Trung tâm TRUNGTAMACF.VN
Đảm bảo hoạt động ổn định, bảo mật dữ liệu cá nhân của Người tham gia.
Kiểm duyệt, chỉnh sửa hoặc gỡ bỏ nội dung vi phạm để bảo vệ môi trường cộng đồng trong sạch.
Tạm ngưng, giới hạn hoặc hủy tài khoản vi phạm tùy mức độ nghiêm trọng.
Phối hợp cung cấp thông tin Người tham gia cho cơ quan nhà nước có thẩm quyền khi được yêu cầu hợp pháp.

IV. Cơ chế xử lý vi phạm
Căn cứ vào mức độ, TRUNGTAMACF.VN áp dụng các biện pháp xử lý phù hợp:

Tạm ẩn nội dung
Nội dung vi phạm nhẹ sẽ bị ẩn hoặc gỡ bỏ để đảm bảo tuân thủ.

Khóa tài khoản
Khóa tạm thời hoặc vĩnh viễn với các hành vi vi phạm nghiêm trọng.

Chuyển cơ quan chức năng
Các hành vi trái pháp luật sẽ được chuyển tới cơ quan có thẩm quyền.

V. Miễn trừ trách nhiệm
TRUNGTAMACF.VN không chịu trách nhiệm về nội dung do Người tham gia đăng tải. Người tham gia tự chịu trách nhiệm trước pháp luật và bên liên quan về toàn bộ thông tin đã chia sẻ.

VI. Chính sách bảo mật
Mọi dữ liệu cá nhân được lưu trữ an toàn, bảo mật theo quy định pháp luật.
Không chia sẻ cho bên thứ ba nếu không có sự đồng ý của Người tham gia, trừ trường hợp pháp luật yêu cầu.
Người tham gia có quyền yêu cầu kiểm tra, chỉnh sửa hoặc xóa dữ liệu cá nhân.

VII. Thay đổi thỏa thuận
TRUNGTAMACF.VN có quyền cập nhật, điều chỉnh thỏa thuận này để phù hợp với quy định pháp luật và chính sách nội bộ. Người tham gia tiếp tục sử dụng dịch vụ được coi là đồng ý với các thay đổi.

Khi tham gia Trung tâm TRUNGTAMACF.VN, bạn cam kết tuân thủ pháp luật và các điều khoản nêu trên.`,
  },
  {
    id: 'legal-4',
    title: 'Về chúng tôi - TRUNGTAMACF.VN',
    description: 'Giới thiệu về Trung tâm TRUNGTAMACF.VN - Quỹ Chống Hàng Giả.',
    publishedAt: '2025-01-20T00:00:00Z',
    content: `I. Giới thiệu chung
Trung tâm TRUNGTAMACF.VN là Quỹ Chống Hàng Giả (Anti Counterfeiting Fund - ACF) là một tổ chức xã hội - nghề nghiệp hoạt động phi lợi nhuận, được thành lập theo Quyết định số 1818/QĐ-BNV ngày 01/12/2015 của Bộ Nội vụ.

Mục tiêu của Quỹ là trở thành cầu nối giữa cơ quan quản lý - doanh nghiệp - người tiêu dùng, chung tay phòng chống hàng giả, hàng nhái và gian lận thương mại tại Việt Nam và khu vực.

II. Lịch sử hình thành & và phát triển
2015: Quỹ được thành lập theo quyết định của Bộ Nội vụ.
2016: Ra mắt Trung tâm Kỹ thuật Chống hàng giả ACF, thực hiện nghiên cứu, chuyển giao công nghệ chống giả cho doanh nghiệp.
2019: Khai trương Phòng trưng bày đối chứng hàng thật - hàng giả tại TP. Hồ Chí Minh, mở cửa miễn phí cho người dân và doanh nghiệp.
2021: Được cấp phép thiết lập Trang thông tin điện tử tổng hợp số 141/GP-TTĐT bởi Cục Phát thanh, Truyền hình & Thông tin điện tử.
2023: Ra mắt Tổng đài Chống hàng giả 1900.066.689, hoạt động 24/7 tiếp nhận thông tin phản ánh từ cộng đồng.

Ngày 1-12-2015, Quỹ Chống Hàng Giả được Bộ trưởng Bộ Nội vụ ban hành quyết định số 1815/QĐ-BNV về việc cấp giấy phép thành lập và công nhận điều lệ hoạt động.
Đội ngũ sáng lập tập hợp các chuyên gia tài chính, truyền thông, kỹ sư công nghệ và nhà quản trị doanh nghiệp, cùng chung khát vọng xây dựng một nền tảng giúp cộng đồng phân biệt đúng-sai, thật giả.
Từ những ngày đầu, Quỹ Chống Hàng Giả là quỹ xã hội hoạt động không vì mục đích lợi nhuận, nhằm hỗ trợ, tài trợ cho các hoạt động phòng, chống hàng giả và gian lận thương mại theo quy định của pháp luật. Song hành cùng với Quỹ trong công tác tuyên truyền chính sách của Đảng, Nhà nước về phòng, chống hàng giả và gian lận thương mại có các tổ chức như Trung Tâm Kỹ Thuật Chống hàng giả ACF; Viện Kỹ thuật Chống Hàng Giả và Gian lận thương mại; Viện Kinh tế và Phát triển Doanh nghiệp; Viện Kinh tế và bảo vệ người tiêu dùng; Tạp chí điện tử Kỹ thuật Chống Hàng Giả và Gian lận Thương mại.
Hiện tại, nền tảng đã mở rộng hợp tác quốc tế, tham gia nhiều diễn đàn chống hàng giả, chống gian lận thương mại, hướng đến việc hội nhập và khẳng định vị thế tại khu vực.

III. Tầm nhìn & Sứ mệnh
Tầm nhìn: Trở thành tổ chức tiên phong tại Việt Nam trong lĩnh vực chống hàng giả, góp phần hội nhập quốc tế trong công tác phòng chống gian lận thương mại.

Sứ mệnh:
1. Bảo vệ quyền lợi hợp pháp của người tiêu dùng.
2. Hỗ trợ doanh nghiệp nâng cao uy tín, thương hiệu chính trực.
3. Nâng cao nhận thức cộng đồng về hàng giả và cách phòng tránh.
4. Phối hợp cùng các cơ quan chức năng xử lý vi phạm.

IV. Giá trị cốt lõi
Chính trực - bạch & trung thực trong thông tin.
Đổi mới - ứng dụng công nghệ hiện đại như blockchain, QR code, AI để nhận diện hàng giả.
Hợp tác - kết nối cơ quan quản lý, doanh nghiệp, người tiêu dùng.
Cộng đồng - lấy quyền lợi xã hội làm trọng tâm.
Bền vững - hướng tới một thị trường minh bạch và lâu dài.
Pháp quyền - luôn tuân thủ pháp luật và các quy định về sở hữu trí tuệ.
Tôn trọng - tôn trọng người dùng, đảm bảo quyền riêng tư và bảo mật thông tin.

V. Hoạt động chính
Truyền thông - Tuyên truyền - Giáo dục
1. Xây dựng các chiến dịch truyền thông quốc gia.
2. Phát hành tài liệu, video và tổ chức hội thảo nhằm nâng cao nhận thức cộng đồng.
3. Phối hợp với báo chí, truyền hình và mạng xã hội để lan tỏa thông điệp "Nói không với hàng giả".

Tư vấn & Hỗ trợ pháp lý
1. Hướng dẫn doanh nghiệp đăng ký bảo hộ thương hiệu, bản quyền và sáng chế.
2. Tư vấn về quy định pháp luật, phương án xử lý vi phạm và bảo vệ quyền lợi hợp pháp.
3. Kết nối luật sư, chuyên gia pháp lý để hỗ trợ doanh nghiệp và người tiêu dùng.

Ứng dụng công nghệ chống giả
1. Tem chống giả, QR code tích hợp thông tin sản phẩm.
2. Sử dụng blockchain để quản lý và truy xuất nguồn gốc minh bạch.
3. Áp dụng AI trong phát hiện mẫu hàng giả, phân tích hình ảnh và dữ liệu.
4. Phát triển hệ thống quản lý truy xuất nguồn gốc cho doanh nghiệp.

Điều tra - Giám sát thị trường
1. Thu thập dữ liệu thị trường, phối hợp cơ quan chức năng kiểm tra đột xuất.
2. Lập báo cáo phân tích định kỳ về tình hình hàng giả, hàng nhái.
3. Vận hành đường dây nóng và hệ thống tiếp nhận phản ánh từ người tiêu dùng.

Đào tạo & Phát triển nguồn nhân lực
1. Tổ chức tập huấn cho doanh nghiệp, sinh viên và cán bộ quản lý về phòng chống hàng giả.
2. Hợp tác với trường đại học, viện nghiên cứu để phát triển giải pháp mới.
3. Xây dựng đội ngũ chuyên gia trẻ, nâng cao năng lực xã hội trong đấu tranh chống hàng giả.

VI. Văn hóa doanh nghiệp & đội ngũ
Văn hóa: trung thực, sáng tạo, đồng lòng cùng mục tiêu phát triển bền vững.
Đội ngũ chính gồm: biên tập viên kinh tế, nhà phân tích tài chính, kỹ thuật, truyền thông - marketing.
Cộng tác viên & chuyên gia ngoại vi: từ các tỉnh, chuyên gia bên ngoài cùng xây dựng nội dung đa chiều, hỗ trợ dự án, điều tra, đào tạo.

VII. Thành tựu & Đối tác nổi bật
Được nhiều người dùng có hiểu biết theo dõi và đánh giá cao nhờ độ tin cậy và tính chuyên sâu trong nội dung.
Hợp tác với các tổ chức, quỹ, doanh nghiệp trong việc tổ chức hội thảo, ký kết và phối hợp truyền thông — ví dụ ACF đã từng ký kết hợp tác với Moët Hennessy trong chống hàng giả tại Việt Nam.
Thực hiện các chương trình truyền thông, diễn đàn để nâng cao nhận thức cộng đồng.
Ví dụ: Tạp chí điện tử Kỹ thuật Chống hàng giả (CHG) là kênh chuyên ngành do ACF đồng hành, chuyên đăng tải bài viết phản biện, kiến nghị và thông tin thị trường.

VIII. Định hướng phát triển tương lai
Ứng dụng công nghệ blockchain, AI để kiểm tra và xác thực thông tin — phát hiện tin giả nhanh và chính xác hơn.
Mở rộng mạng lưới đối tác ngoại vi, hợp tác truyền thông, tổ chức & pháp lý ở cả trong nước và quốc tế.
Phát triển ứng dụng di động (mobile app) để người dùng dễ dàng truy cập thông tin, phản ánh vi phạm, tra cứu mã QR, xác thực sản phẩm.
Xây dựng hệ sinh thái kiến thức - cộng đồng - kết nối doanh nghiệp: liên kết các diễn đàn, nền tảng giáo dục, mạng xã hội, doanh nghiệp để chia sẻ dữ liệu, cảnh báo, hỗ trợ lẫn nhau.

IX. Quy định & Chính sách cơ bản
Quy định chung
Người dùng khi đăng bài, bình luận phải tuân thủ luật pháp Việt Nam.
Nghiêm cấm nội dung vi phạm pháp luật, chống phá nhà nước, kích động bạo lực, xâm phạm uy tín tổ chức, cá nhân.

Kiểm duyệt nội dung
Ban kiểm duyệt xét duyệt bài viết trước khi đăng.
Bài vi phạm sẽ bị xoá, chỉnh sửa hoặc khóa tài khoản tùy tình trạng vi phạm.

Bảo mật & thông tin cá nhân
Cam kết bảo vệ thông tin cá nhân người dùng.
Không chia sẻ, bán thông tin cá nhân cho bên thứ ba nếu không có sự đồng ý rõ ràng từ người dùng.

Trách nhiệm người dùng
Người dùng chịu trách nhiệm về nội dung do mình đăng tải.
Không được sử dụng tài khoản cho mục đích vi phạm pháp luật hoặc vi phạm điều khoản của ACF.

Quyền bảo lưu & thay đổi điều khoản
Chúng tôi có quyền điều chỉnh các điều khoản, chính sách và công bố phiên bản mới khi cần.
Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được công bố đồng nghĩa người dùng chấp thuận các cập nhật đó.

X. Liên hệ
Trụ sở chính
Số 2 ngõ 59 phố Quan Hoa, Phường Nghĩa Đô, TP Hà Nội
Điện thoại: 024.3767.5603 | Hotline: 097.173.6789
Website: trungtamacf.vn
Email: trungtamacf@gmail.com
Tổng đài Chống hàng giả: 1900.066.689

Văn phòng đại diện
TP HCM: Số 360 Lạc Long Quân, Phường Hòa Bình, TP Hồ Chí Minh
Đồng Nai: QL51B, Xã Long Thành, Tỉnh Đồng Nai
ĐT: 0901.422.227 | Hotline: 0971.736.789
TP Cần Thơ: Số 75 Huỳnh Cương, Phường Ninh Kiều, TP Cần Thơ
ĐT: 0338.283.339 | Hotline: 097.173.6789`,
  },
  {
    id: 'legal-5',
    title: 'Chính sách riêng tư - TRUNGTAMACF.VN',
    description: 'Chính sách bảo vệ thông tin cá nhân và quyền riêng tư của người dùng.',
    publishedAt: '2025-01-20T00:00:00Z',
    content: `1. Mục đích và phạm vi thu thập
TRUNGTAMACF.VN chỉ thu thập các thông tin cá nhân khi bạn đăng ký tài khoản, gửi phản hồi, hoặc thực hiện tương tác cần xác thực. Mục đích là quản lý tài khoản, cung cấp dịch vụ và hỗ trợ người dùng.

2. Phạm vi sử dụng thông tin
Thông tin thu thập được dùng để:

Quản lý tài khoản, xác minh người dùng.
Gửi thông báo, thư điện tử liên quan đến hoạt động của trung tâm.
Hỗ trợ khiếu nại, xác minh thông tin, loại bỏ nội dung vi phạm.

3. Bảo mật dữ liệu
Chúng tôi cam kết bảo vệ thông tin cá nhân người dùng bằng các biện pháp kỹ thuật & quản lý phù hợp. Dữ liệu chỉ được truy cập bởi bộ phận có quyền, và không chia sẻ với bên thứ ba trừ khi có yêu cầu pháp lý.

4. Quyền của người dùng
Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình theo quy định pháp luật.

5. Lưu giữ và xóa dữ liệu
Dữ liệu cá nhân sẽ được lưu trữ trong khoảng thời gian cần thiết cho dịch vụ. Khi không còn cần thiết, trung tâm có quyền xóa hoặc vô hiệu hóa dữ liệu theo quy định.

6. Cách thức liên hệ
Nếu bạn có thắc mắc về Chính sách riêng tư, vui lòng liên hệ qua Email: info@trungtamacf.vn hoặc Hotline: 024.7300.8888

Việc sử dụng dịch vụ tại Trung tâm TRUNGTAMACF.VN đồng nghĩa bạn chấp thuận với Chính sách Riêng tư này.`,
  },
];

export const legalService = {
  async listDocuments() {
    await delay();
    return legalDocs;
  },
  async getDocument(id) {
    await delay();
    return legalDocs.find((doc) => doc.id === id) ?? null;
  },
};
