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
  orders.js         # Bảng đơn đặt hàng của dân làng (đơn, thưởng, hạn)
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
- **Bếp lửa mạnh** (cấp 0–6, xem mục Bếp bên dưới): nấu nhanh ×1 → ×2 (`G.updateKitchen`).
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

## Cảnh nước (sông, ao sen, mương, giếng, thuyền)

- **Sông** (`river(b,y)` trong `core.js`, dùng ở ruộng, làng, chợ, khu thú cưng): bờ đất ướt có sỏi và cỏ rủ, nước 5 dải nông → sâu chuyển bằng rây điểm ảnh, vệt sáng tối, bọt sát bờ, lau sậy, đá có bọt quanh chân, lá sen rải rác. **Sóng động** `rip(t,y,ww)`: vệt sáng trôi với 3 tốc độ, điểm lấp lánh nhấp nháy, bọt bờ trôi chậm. Tham số `y` của `rip` = mép trên mặt sông + 2.
- **Bộ dựng nước** (`js/art.js`): `A.pond` (ao bờ không tròn đều: đất ướt, đá, lau sậy, nước 4 tông, bọt mép, lá và hoa sen), `A.waterRect` (mương bờ đất + đá), `A.well` (giếng: thành đá có rêu, trụ gỗ, mái rơm, tời, dây gàu), `A.reeds`, `A.rockW`, `A.pad` (lá sen), `A.lotus` (hoa sen). Vẽ động (truyền `cx`): `A.sampan` (thuyền mui tre bập bềnh, đèn lồng, vệt nước), `A.koi` (cá chép bơi, đuôi vẫy), `A.ring` (vòng sóng loang).
- Làng (`zones/hub.js`): ao sen có 2 con cá chép bơi vòng quanh và 3 vòng sóng loang quanh lá sen, mương có cầu gỗ + hoa sen + lau, thuyền chạy ngang sông. Ruộng (`zones/farm.js`): giếng mới.

## Bố cục và tỉ lệ (làng, ruộng)

- **Kiểm tra chỗ trống**: `roomFor(danhSáchKhung,x,y,w,h,pad)` (core.js) trả `true` nếu khung mới không đè khung nào. Mỗi khu có danh sách `K` gồm khung của công trình, đường, nước; cây, bụi, hoa chỉ được đặt vào chỗ trống (xem `zones/hub.js`, `zones/farm.js`). Thêm công trình mới thì thêm khung của nó vào `K` trước khi rải cây.
- **Tỉ lệ cây**: `A.tree(b,x,y,màu,s)` có tham số `s` (mặc định 1). Cây nền dùng `s` 1.3–1.5 (cao khoảng 43–50px, hơn nhà lá khoảng 5px) để không còn nhỏ như bụi cạnh nhà.
- **Làng**: quảng trường bắt đầu đúng mép dưới Chợ và Thú cưng (y=66), đường ngang nằm dưới đáy cổng Ruộng nhà và Xe đẩy (cổng vẽ ở y=162, điểm bước tới giữ y=184), cụm mương + cầu + nhà lá dời sang phải 10px, trâu và chó không còn đè nhau.
- **Ruộng**: bản đồ **700×400** (trước 520×300). Luống rau (10×6 ô, x 155–431, y 18–172) giữ nguyên chỗ; chuồng dời sang x 456–638 (rộng 186px, chỗ ở của vật nuôi rộng hơn), cách luống hơn 30px; nhà bếp giữ nguyên; hàng rào ở y=178, giếng ở (314,230), đường đất y 262–288, sông y=330, cổng "Về làng" ở (650,288). Giới hạn đi lại `BND.farm` = [10,20,690,318], kích cỡ camera ở `G.CFG.world.farm`.

## Bếp: nấu theo sao, đơn đặt hàng, nâng cấp

- **Nấu song song**: 3 chõ chạy cùng lúc (`G.POTS`). Món chín nằm trong chõ chờ bạn thu (chạm chõ, nút "Thu món chín" hoặc nút trong cửa sổ Bếp); không bao giờ bị hỏng.
- **Sao theo độ nhanh tay** (`G.quality`): thu trong 20 giây sau khi chín được 3★, trong 60 giây được 2★, lâu hơn 1★. Trên mỗi chõ đã chín có thanh nhỏ cho biết còn bao lâu thì tụt sao. Món 2★/3★ là vật phẩm riêng `id_2`, `id_3` (1★ vẫn là `id` gốc nên save cũ chạy bình thường), giá bán lẻ ×1 / ×1.4 / ×1.9 (`G.STAR_MUL`). Hàm tiện ích: `G.dishId(id,sao)`, `G.dishStock(id,saoTốiThiểu)`, `G.starOf`, `G.baseOf`. Icon 2★/3★ tự sinh ở `icons.js` (món gốc + sao vàng).
- **Bảng đơn đặt hàng** (`js/orders.js`, bảng trên tường trái bếp, huy hiệu: đỏ = số đơn đang có, xanh = số đơn giao được ngay): mở sau khi thu hoạch những cây đầu tiên (`S.quest>=2`). Tối đa 3 đơn cùng lúc, thời hạn 15 phút chơi, đơn mới cách nhau 2–3,5 phút. **Giới hạn theo ngày game** (`G.ORD.perDay` = 3; 1 ngày game = 120 giây chơi): mỗi ngày chỉ được đặt tối đa 3 đơn và giao tối đa 3 đơn, sang ngày mới thì đếm lại (`S.ord.dd`); giao xong không còn làm đơn mới đến sớm hơn. Mô phỏng người chơi lý tưởng 2 giờ: trung bình 0,74 đơn/ngày, nhiều nhất 1 đơn/ngày, khoảng 140 xu/phút tổng thưởng (chưa trừ vốn nguyên liệu). Món lấy từ các món đã mở khoá (kể cả 16 món xe đẩy không bán). Số lượng và yêu cầu sao tăng theo số khách đã phục vụ và số đơn đã giao. Thưởng = giá món × số lượng × (1.6 + 0.3 × (sao yêu cầu − 1)), khoảng 2.7 lần giá bán lẻ, có 40% kèm +2 uy tín và 40% kèm 3 hạt giống. Giao đơn lấy món sao thấp nhất đủ yêu cầu trước. Chỉnh độ khó ở `G.ORD` và hàm `make()`. Khoản thu ghi vào sổ thu chi với loại "Giao đơn đặt hàng".
- **Nâng cấp bếp 6 cấp** (`G.KIT_COST`, `G.KIT_SPEED`, `G.KIT_MAX`): giá 150 / 350 / 700 / 1600 / 3500 / 8000 xu, tốc độ nấu ×1 → ×3.2, và mỗi cấp thêm 5% cơ hội một mẻ ra 2 phần (`G.kitDouble`).
- Kệ lá chuối trong bếp giờ hiển thị tối đa 4 món đang có (trước đây xếp cả 20 món ra ngoài màn hình).

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
