# Xóm Chanh — cấu trúc file

Mở game: mở `index.html`. Sau khi sửa file trong `js/`, chạy `python3 build.py` để gộp lại vào `index.html` (index.html chứa bản gộp, không load `js/` trực tiếp).

## Cấu trúc

```
index.html          # HTML + CSS + HUD, load các script
js/
  core.js           # Dữ liệu game, player, camera, assets, vẽ chung
  ui.js             # Giao diện túi đồ, thanh ô nhanh, vòng lặp
  art.js            # Bộ vẽ chibi pixel dùng chung (khối, cây, nhà, sprite lớn của cây/vật nuôi)
  plants.js         # Hình cây trên ruộng: mỗi loại 5 giai đoạn (hạt · mầm · nhỏ · lớn · chín)
  music.js          # Nhạc nền lofi chill tạo bằng Web Audio
  menu.js           # Màn hình mở game (Chơi tiếp / Chơi lại / Cài đặt) + nút và bảng cài đặt
  icons.js          # Icon vật phẩm / nguyên liệu / hạt / món ăn / vật nuôi / xu, vẽ bằng code 16×16
  audio.js          # Âm thanh (Web Audio tự tổng hợp, chỉ quan sát trạng thái game, nút bật/tắt góc phải)
  zones/
    farm.js         # Trang trại (60 ô, nhà bếp, vật nuôi)
    market.js       # Chợ
    kitchen.js      # Bếp nấu
    shop.js         # Quán bán
    hub.js          # Map làng chung (POI)
    pets.js         # Khu thú cưng
```

## Sửa map nào → mở file đó

| Map | File |
|-----|------|
| Trang trại | `js/zones/farm.js` |
| Chợ | `js/zones/market.js` |
| Bếp | `js/zones/kitchen.js` |
| Quán | `js/zones/shop.js` |
| Làng (hub) | `js/zones/hub.js` |
| Thú cưng | `js/zones/pets.js` |

Logic chung (đi bộ, túi đồ, công thức): `js/core.js` + `js/ui.js`.
Âm thanh: `js/audio.js` (muốn chỉnh to/nhỏ hay đổi tiếng nào → sửa trong bảng `SND`).

Các zone ghi vào `G.zones` / `Z` và dùng chung `G.travelTo`, `G.drawPOI`.

## Cơ chế tiến trình (đã thêm)

- **Mở rộng ruộng từng ô một**: bắt đầu 10 ô (cả hàng trên cùng), mở lần lượt từ hàng trên xuống dưới, trong mỗi hàng từ phải sang trái (`G.plotOrder`, `G.plotOpen`, số ô đang mở `S.plotsOpen`). Ruộng chỉ vẽ đúng 1 ô khoá kế tiếp, chạm vào ô đó là mua thẳng (`G.buyPlot`, giá ô mua đầu tiên `G.PLOT_COST0` = 200 xu, mỗi ô sau nhân `G.PLOT_COST_MUL` = 1.35, trần `G.PLOT_COST_MAX` = 200000 xu/ô, 10 ô đầu `G.PLOT_FREE` miễn phí; nhãn giá trên ô khoá rút gọn bằng `G.shortNum`, ví dụ 1500 → 1.5k). Bảng *Nâng cấp* (mở từ giá dụng cụ trong bếp) cũng có nút mua ô; giá bếp ở `G.KIT_COST`, tốc độ `G.KIT_SPEED` trong `core.js`. Save cũ mở theo hàng (`rows`) được quy ra số ô và giữ nguyên các ô đã mở; khu ruộng xuất hiện gần hàng ô đầu tiên (`START.farm`).
- **Thời gian lớn của cây** (`time` trong `G.CROPS`, tính bằng giây chơi game, không chạy khi tắt game): rau 36–45s, củ/hạt 60–130s, chuối 270s, dừa 360s. Lãi mỗi giây của một ô đất khoảng 0.17 (rau) → 0.12–0.13 (củ, hạt) → 0.10–0.11 (cây thân gỗ), nên không cây nào vượt trội; cây thân gỗ bù lại bằng sản lượng mỗi lần thu cao. Thêm cây mới thì cân theo mức này.
- **Bếp lửa mạnh** (cấp 0–3): nấu nhanh ×1 → ×2 (`G.updateKitchen`).
- **Uy tín quán** (1–5 sao, `G.stars`, `G.addRep` trong `restaurant.js`): khách vui +2/+3, khách bực bỏ về −5; nhiều sao → khách đến nhanh hơn, 4–5 sao có tiền thưởng.
- **Tiện ích**: nút *Thu hoạch hết* (ở trang trại khi có đồ chín) và *Nấu lại* (trong bảng bếp).


## Mở / đóng cửa quán (đã thêm)

- Quán mặc định **đóng cửa**. Vào Nhà hàng → bấm **Mở cửa đón khách** (nút góc phải) thì khách mới đến; **Đóng cửa** thì ngừng đón, khách đang ở trong quán vẫn được phục vụ nốt (`G.openShop` / `G.closeShop`, cờ `G.S.open`, trong `restaurant.js`).
- Khi **không ở trong quán**, khách đứng yên (không đến thêm, không hết kiên nhẫn) → làm trang trại / đi chợ không bị trừ uy tín.
- Khách ra quầy sẽ **tự được nhận order** sau 1,5 giây (chạm vào để nhận ngay). Chạm khách khi chưa có món → tự mở bảng nấu đúng món đó.

## Xe đẩy — màn bán góc nhìn thứ nhất (bước 1 của hệ thống 3 cấp)

- File: `js/zones/stall.js` (zone `stall`, cổng "Xe đẩy" ở làng thay cho "Nhà hàng"; quán cũ `zones/shop.js` vẫn còn trong code để làm cấp 3 sau).
- Chơi: bấm bảng **ĐÓNG CỬA → ĐANG BÁN** để mở bán. Khách ra quầy gọi món (phiếu bên trái cho biết cần gì). Chạm **khay nguyên liệu** để đặt lên đĩa, đủ rồi bấm **Giao món**.
- **Phạt thật:** đặt sai / thừa nguyên liệu → món HỎNG, không giao được, chỉ còn **Đổ đi** và mất hết nguyên liệu đã đặt. Nguyên liệu lấy từ kho (ruộng + chợ).
- Giao nhanh (kiên nhẫn còn > 50%) được +20% tiền; khách chờ hết kiên nhẫn bỏ về → −5 uy tín; **Từ chối** khách → −1 uy tín.
- Menu xe đẩy (`MENU` trong stall.js): trà chanh, cà phê sữa, bánh mì, gỏi cuốn — mở khoá theo số khách đã phục vụ (`unlock` trong `G.RECIPES`). Khay hiển thị = nguyên liệu các món đã mở khoá (+ khay "gây nhiễu" cho đủ 8).
- Ở ngoài xe đẩy khách đứng yên. Cờ mở bán riêng của xe đẩy là `G.S.stall.open` (`G.openStall` / `G.closeStall`); cờ `G.S.open` chỉ còn dùng cho quán cũ `zones/shop.js`.
- Màn first-person dùng cờ `fp:true` trên zone: chạm là hành động ngay, không đi bộ (xử lý trong `ui.js`).

## Chữ & hình món (cập nhật)

- **Mọi chữ dùng Be Vietnam Pro:** chữ trong canvas đi qua `T`/`TS` (core.js) → xếp hàng → vẽ lên lớp `#tx` có độ phân giải bằng màn hình (nét chữ sắc, không vỡ hạt). Chữ DOM (nút, bảng) cũng ép `font-family: inherit` về Be Vietnam Pro. Đã nạp thêm các độ đậm 500/700.
- **Hình món hoàn chỉnh:** `DISH` trong `zones/stall.js` vẽ pixel-art bằng code cho trà chanh, cà phê sữa, bánh mì, gỏi cuốn. Hình **lên dần theo từng nguyên liệu** đặt lên đĩa; đủ nguyên liệu = món hoàn chỉnh (thêm ống hút / chén nước chấm, lấp lánh). Hình món cũng hiện trong bong bóng của khách và bay sang khách khi giao. Món chưa có hình riêng tự rơi về icon cũ. Thêm món mới: thêm 1 hàm vào `DISH` (xem mẫu `tra_chanh`).
- Ở màn bán (`fp`), thanh túi đồ tự ẩn (class `body.fp #bar`) để không che nút Giao/Đổ/Từ chối.

## Tiến trình: cấp quán + nhiệm vụ (`js/progress.js`)

- **Cấp quán `G.S.tier`:** 0 = xe đẩy cũ của bà còn phủ bạt ở làng (chưa vào được), 1 = đã sửa xe đẩy. Chạm vào cổng xe đẩy khi cấp 0 → bảng "Sửa lại chiếc xe đẩy cũ" (`G.enterZone` → modal `build` → `G.buildStall`).
- **Hình cổng đổi theo cấp:** `POI_TIER` trong `core.js` (`poiCovered` cấp 0, `poiCart` cấp 1). Thêm cấp 2, 3 = viết thêm hàm vẽ rồi thêm vào mảng này (ngôi nhà `poiShop` để dành cho cấp nhà hàng).
- **Giá sửa xe `G.PROG.stallCost` = 1000 xu.** Cân theo mô phỏng nông trại với thời gian lớn mới (10 ô đất đầu game, mỗi cây 30% ra thêm 1): người chơi trồng liên tục loại nhanh nhất ~9–10 phút, người chơi thường ~15–20 phút. Đây là số ước lượng, chưa chơi thử. Muốn pha làm nông dài hơn thì tăng số này.
- **Chanh là cây trồng** (`G.CROPS.chanh`), không còn bán ở chợ. Save mới có 4 hạt chanh, không tặng sẵn nguyên liệu.
- **Nhiệm vụ:** góc dưới trái chỉ có 1 nút nhỏ (có chấm đỏ khi có thưởng chờ nhận, tự ẩn ở màn bán); bấm vào mở bảng `quest` (ui.js) gồm 2 tab:
  - **Nhiệm vụ chính** = *Cốt truyện* (`G.STORY`, hiện đang trống, điền nội dung vào mảng này) + *Hướng dẫn* (`G.QUESTS`, 7 bước từ gieo hạt đến phục vụ 12 khách). Hai chuỗi chạy chung bộ máy `stepQuests`: mỗi bước có `p(S)` trả `[đã có, cần]`, `r` là thưởng, `note` là lời thoại; chương cốt truyện có thêm `txt` là lời kể. Tiến độ lấy từ `G.S.stat` (đếm trong `G.plotClick`), `S.money`, `S.tier`, `S.served`; vị trí hiện tại lưu ở `S.quest` / `S.story`.
  - **Hàng ngày:** mỗi ngày thật (đổi lúc 0h) có 3 việc chọn cố định theo ngày từ `DAILY_POOL`; tiến độ = số hiện tại − mốc đầu ngày (lưu ở `S.daily`), bấm **Nhận** để lấy thưởng. Việc phục vụ khách chỉ xuất hiện khi đã sửa xe đẩy.
- **Save cũ:** đã phục vụ khách thì tự coi như có xe đẩy và bỏ qua các nhiệm vụ đầu (xử lý ở phần chuyển đổi save trong `core.js`).
- Lưu ý khi thêm code: mọi file `js/` được gộp thành một script, nên biến khai báo cấp cao nhất không được trùng tên giữa các file (đã từng trùng `acc`); đặt biến cục bộ trong hàm/closure.

## Icon vật phẩm & món ăn (`js/icons.js`)

- Mỗi icon là 1 hàm trong `PAINT[id]`, vẽ trên lưới **16×16**, tự thêm viền đậm 1px nên ảnh thật là 18×18 (bản cũ 8×8 nằm ở `core.js` nay chỉ còn icon giao diện: balo, sổ, nhiệm vụ, sao, mặt, mặt trời). Ánh sáng luôn từ trên-trái, mỗi khối có 3 tông sáng/vừa/tối.
- Bộ công cụ vẽ: `ball` (khối tròn có sáng/tối), `strip` (lá, củ, trái dài, có độ rộng thay đổi), `ell`, `rect`, `line`, `tri`, `dots`; khung dùng chung `bowl`, `plate`, `glass`, `sack`, `seedPacket`. Thêm icon mới = thêm 1 hàm vào `PAINT` (hoặc vào khối `Object.assign(PAINT,{...})` cùng nhóm).
- Phủ **74 icon**: 13 cây trồng, 13 túi hạt (`hat_*`, nhãn theo màu cây trong `G.CROPS`), sản phẩm vật nuôi, hàng ở chợ, 20 món ăn, 5 vật nuôi, xu, ô đất. Id nào không có trong `PAINT` thì rơi về icon cũ ở `core.js`.
- `IM()` (core.js) tự làm mịn khi vẽ icon nhỏ hơn 18px lên canvas để không mất nét; icon trong túi đồ và khung chi tiết được phóng to ở CSS (`.cell .ic`, `.side .big .ic`).
- Hình món **lên dần theo từng nguyên liệu** ở màn xe đẩy vẫn là `DISH` trong `zones/stall.js` (24×22), không đổi.

## Hình cây theo giai đoạn (`js/plants.js`)

- Mỗi cây trong `G.CROPS` có sprite riêng 22×24 cho 5 giai đoạn, chia theo % thời gian lớn: **<12% hạt gieo · <35% mầm · <65% nhỏ · <100% lớn · 100% chín** (`G.plantStage`). Hình chín có quả/bông/buồng thật: cà chua đỏ, ớt đỏ rủ, lúa và nếp vàng cúi, chanh xanh trên tán, buồng chuối vàng, dừa trên ngọn, cà rốt lộ vai củ, đậu phộng lộ củ ở gốc.
- Các dạng cây dùng chung: `blade` (hành), `herb` (rau thơm), `greens` (rau muống), `tomato`, `chili`, `carrot`, `rice` (nếp, gạo), `bean` (đậu xanh, đậu phộng), `lime`, `banana`, `coco`. Cây mới: thêm vào `G.CROPS` rồi thêm 1 dòng vào `PLANT` ở cuối khối, dùng lại 1 dạng có sẵn hoặc vẽ dạng mới bằng `G.paint` (bộ công cụ chung với `icons.js`).
- Hình cây cũ (`sprout`, `grow`, mẫu `FRU` dùng chung) đã xoá khỏi `core.js` và `art.js`.

## Nhà và công trình (bộ dựng nhà trong `js/art.js`)

- Bộ dựng dùng chung `A.thatch` (mái rơm hình thang: thớ rơm, 3 dải đậm nhạt, mép dưới tua tủa, gờ nóc có cọc chéo), `A.tiles` (mái ngói đỏ lợp so le), `A.walls` (vách ván đứng có khe, vân gỗ, nền đá), `A.win` (cửa sổ: khung, kính 2 tông, chớp, rèm, hộp hoa), `A.door` (cửa gỗ có tay nắm, ô kính, bậc đá, thảm chân), `A.hang` (dây ớt, tỏi, bắp treo), `A.hay` (bó rơm tròn), `A.awning` (mái hiên vải sọc lượn sóng).
- Dùng cho: `A.hut` (3 nhà sàn trong làng + nhà đối diện), cổng vào khu ở `core.js` (`poiFarm`, `poiMarket`, `poiPets`, `poiShop`) và chuồng vật nuôi ở nền `zones/farm.js`. Vị trí, kích thước và vùng bấm của các công trình giữ nguyên như cũ.
- Các hàm `poi*` nhận thêm tham số cuối `b` (mặc định là canvas game) để vẽ thử ra canvas riêng khi cần xem hình.
- Chưa đổi: xe đẩy (`poiCovered`, `poiCart`), cổng `poiGate`, nội thất bếp và cửa hàng.

## Cảnh quan (trời, mây, đồi, cỏ, nhà phố nền)

- `A.sky(b,w,h)` bầu trời 6 dải xanh đậm → nhạt, chuyển dải bằng rây điểm ảnh · `A.sun(b,x,y,r)` mặt trời có quầng và tia · `A.cloud(b,x,y,s)` mây xốp nhiều khối, đáy phẳng, bóng xanh nhạt phía dưới (`s` = tỉ lệ) · `A.hills(b,x,y,w,h,c,seed)` dãy đồi/núi xa có sống đồi sáng và cây nhỏ trên sườn. Tất cả ở `js/art.js`.
- `A.town(b,x,y,w,gy,tường,mái,{chim,sign,left,sh,cur,door})` nhà phố nền (không tương tác): vữa trát, đá góc, chân tường, gờ tầng, mái ngói + ống khói, cửa sổ chớp + hộp hoa, cửa chính, biển treo. Dùng cho dãy phố sau quầy ở `zones/stall.js`.
- `grass(b,y0)` (core.js): cỏ 4 tông + vạt sáng/tối hình elip + vạt đất trống + sỏi + cụm cỏ 3 lá + cỏ ba lá + cụm hoa dại; `y0` là hàng bắt đầu phủ cỏ (làng dùng 56 để chừa chỗ cho trời và đồi).
- Làng (`zones/hub.js`): trời, mặt trời, 5 đám mây, 3 lớp đồi rồi mới tới cỏ. Vì chợ và cửa hàng thú cưng nằm sát mép trên bản đồ nên phần trời chủ yếu lộ ở hai bên. Ruộng (`zones/farm.js`): thêm bìa cỏ bên trái có cây, bụi, đá, hoa.

## Nhạc nền, cài đặt, màn hình mở game

- **Nhạc lofi** (`js/music.js`): 72 BPM có swing; hợp âm 7/9 chơi bằng đàn Rhodes (tremolo, lọc mềm), bass trầm, nốt chuông thưa có vang và vọng, trống nhẹ, tiếng xào xạc đĩa than, bão hoà nhẹ kiểu băng từ. Chuỗi hợp âm (`PROG`) đổi ngẫu nhiên mỗi 4 ô nhịp; trống vào sau 2 ô nhịp đầu. Nhạc bắt đầu sau cử chỉ đầu tiên của người chơi (quy định của trình duyệt) và nhỏ dần vào trong 3.5 giây. Không dùng file âm thanh nào.
- **Âm thanh** (`js/audio.js`): kênh hiệu ứng và kênh nhạc tách riêng, mỗi kênh có công tắc + âm lượng, lưu ở `localStorage` khoá `xoiBenDua_set` (`G.audio.cfg`: `mOn`, `mVol`, `sOn`, `sVol`). Nút loa ở góc vẫn là công tắc tắt/bật tất cả.
- **Cài đặt** (`js/menu.js`): nút bánh răng dưới nút loa. Bảng có nhạc nền, hiệu ứng, Màn hình chính, Chơi lại (có hỏi xác nhận), Đóng.
- **Màn hình mở game**: Chơi tiếp (khoá nếu chưa có ván, hiện "Ngày · xu" nếu có), Chơi lại (hỏi xác nhận nếu đang có ván), Cài đặt. Game tạm dừng (`G.paused`) khi màn này mở. **Chơi lại** xoá save rồi tải lại trang, nên mọi thứ bắt đầu sạch và bỏ qua màn mở game một lần.
- **Sửa lỗi mở hết ô đất**: trước đây save thiếu hoặc hỏng trường `plotsOpen` bị coi là save cũ và mở hết 60 ô. Giờ save như vậy về 10 ô đầu; save kiểu cũ có `rows` vẫn quy đổi theo hàng. Số ô luôn được kẹp trong 10…60.

## Ghi chú kỹ thuật

- **Sprite nhân vật** (sheet 64×64, 4 cột frame × 4 hàng hướng): hàng 0 = xuống, 1 = trái, **2 = lên (quay lưng)**, **3 = phải**. Bảng chọn hàng ở `chr()` (core.js) và `c.dir` của khách ở `restaurant.js` đều theo thứ tự này.
- **Vật phẩm dùng hết:** kho chỉ đổi qua `G.add`; khi một vật phẩm về 0, `G.dropHot` gỡ nó khỏi ô nhanh, bỏ cầm tay và bỏ chọn. Khi tải save, ô nhanh còn giữ vật phẩm đã hết cũng được dọn.

## Tên game / tên làng

- Tên hiển thị là `G.VILLAGE` (core.js, hiện là "Xóm Chanh"): dùng ở thanh tên khu vực, bảng sửa xe và các nhiệm vụ. Đổi ở đó là đổi khắp game; riêng thẻ `<title>` nằm trong `index.html`.
- Hai khoá lưu nội bộ `xoiBenDua` (core.js) và `xoiBenDua_snd` (audio.js) **cố ý giữ nguyên** vì người chơi không thấy chúng, còn đổi tên sẽ làm mất save và cài đặt âm thanh cũ.

## Sổ sách (`js/book.js` + modal `book` trong `ui.js`)

- Nút nhỏ ở **góc trên bên phải**, cạnh nút nhiệm vụ (khung `#tools` trong `index.html`; nút âm thanh nằm ngay dưới). Hai nút dùng chung kiểu `.tbtn`.
- Sổ có 2 tab (`G.ui.btab`):
  - **Công thức:** liệt kê mọi món trong `G.RECIPES`, chia nhóm *Xe đẩy* (`G.STALL_MENU`, khai báo ở `zones/stall.js`) và *Nhà hàng*. Món đã mở khoá hiện hình món hoàn chỉnh (nếu có), nguyên liệu kèm số đang có/cần và nguồn (trồng / nuôi / chợ), giá bán, vốn ước tính, lãi ước tính (`G.bookRecipes`). Món chưa mở hiện "bí ẩn" kèm điều kiện mở khoá.
  - **Thu chi:** thu, chi, lãi hôm nay (theo "Ngày" trong game), chi tiết theo loại khoản, biểu đồ lãi 7 ngày gần nhất, tổng từ đầu game (`G.bookMoney`). Dữ liệu lưu ở `S.book`, theo ngày chỉ giữ 14 ngày gần nhất.
- **Mọi thay đổi tiền phải đi qua `G.earn(n, loại)` / `G.spend(n, loại)`** (không cộng trừ `S.money` trực tiếp) thì sổ mới ghi đủ. Các loại khoản nằm ở `G.BOOK_CAT`; thêm loại mới thì thêm vào đó.
- Ý tưởng tab tiếp theo (chưa làm): thống kê khách (số khách, chuỗi món không hỏng, món bán chạy), kho nguyên liệu kèm cảnh báo sắp hết, bảng giá chợ.
