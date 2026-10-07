
// DỮ LIỆU GAME: muốn thêm cây / con vật / món ăn → sửa file này
const G = window.G = {};
G.CROPS = { // seed: giá hạt, time: giây lớn, color: màu vẽ
  nep:{n:'Nếp',seed:5,time:15,sell:12,color:'#e8d27a'},
  dau_xanh:{n:'Đậu xanh',seed:8,time:20,sell:18,color:'#6fae4e'},
  hanh:{n:'Hành lá',seed:4,time:12,sell:9,color:'#3f9a4a'},
  dua:{n:'Dừa',seed:15,time:35,sell:40,color:'#8b5a2b'}
};
G.ANIMALS = { // cost: giá mua, make: sản phẩm, time: giây ra sản phẩm sau khi cho ăn
  ga:{n:'Gà',cost:50,make:'trung',time:18,color:'#fff'},
  bo:{n:'Bò',cost:200,make:'sua',time:30,color:'#d9a066'}
};
G.ITEMS = { // vật phẩm khác (mua ở chợ / sản phẩm vật nuôi)
  trung:{n:'Trứng',sell:15}, sua:{n:'Sữa',sell:35},
  cam:{n:'Cám',buy:2,sell:1}, duong:{n:'Đường',buy:4,sell:2}, muoi:{n:'Muối',buy:2,sell:1}
};
for(const k in G.CROPS){const c=G.CROPS[k];G.ITEMS[k]={n:c.n,e:c.e,sell:c.sell};G.ITEMS['hat_'+k]={n:'Hạt '+c.n,buy:c.seed,sell:Math.floor(c.seed/2)}}
G.RECIPES = { // need: nguyên liệu, time: giây nấu, price: giá bán
  xoi_dau:{n:'Xôi đậu xanh',need:{nep:1,dau_xanh:1},time:6,price:45},
  xoi_man:{n:'Xôi mặn',need:{nep:1,hanh:1,trung:1,muoi:1},time:8,price:70},
  xoi_dua:{n:'Xôi dừa',need:{nep:1,dua:1,duong:1},time:8,price:95},
  flan:{n:'Bánh flan',need:{trung:2,sua:1,duong:1},time:10,price:130}
};
for(const k in G.RECIPES)G.ITEMS[k]={n:G.RECIPES[k].n,e:G.RECIPES[k].e,sell:Math.floor(G.RECIPES[k].price*.6)};
G.CFG = {plots:60,maxAnimals:8,maxCustomers:5,customerEvery:8,patience:50,startMoney:80,
  // world size per zone (larger than canvas for camera follow)
  world:{farm:{w:520,h:300},market:{w:420,h:240},kitchen:{w:400,h:230},shop:{w:400,h:230},hub:{w:640,h:360},pets:{w:400,h:230}}};
G.ASSETS={
  house_red:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAu5JREFUeJztm89rGkEUx7+GtBehIGiViqdCoFAWCgmtkHgITf6AXPInCOle9tyz573Ygn9CoPQPaCWUNCUpWyhIQAj0JG1dEiiUevJgD3HMur8cx12fszufm/Nmd958nZ15+3xm4CBf0kZICTf9TgYAMqwhX9JGrWKRzqMlU7dt3PQ7mXVqR6KgbtuBtllfqvQC1G0bptkMtht6qAjSC8AwDB1Pn+1NPl9+/xgqDCMxAgC3k56XtRj8kIrErACe5e5HIgT4ctEVvlY9AtQOLEqrWAQ+vQu0780TB4QFFEllHbgNg19vPYFWyVL7szQ6vQEaFkap3wOUANQOUDPZBLVKFrsvH1D6slzaACyHAG++/kCnVyL0aLl8/tUHoB6B6TigYYmHlLJRK+cAjFNiLBfolzio23ZoQkFWOwv61oC7BGHa8OQEqw//eTq1UPRtl94+jvpTvwkqAagdoEYJQO0ANUoAageoUQJQO0CNEoDaAWqUANQOUKMEoHaAmqkiqWvjnqdDwRzCr112e8EcehMiv9v3fW4xDGiX3T4E4FgBgH+dYK2cw+nPP4G3l9XuqRME7n4kTToNqzsRQG2C7oZ8SRuxnHnY0pIN55ycWXDfCpFXzx8DAHZ6AzSsrnAB0ipgGDqctQ+n779N2VP/CHDXCG1XNwAAWy/2Y3MGAKyLD5Hd6+z8amYfoSKp67e7IpfNpHB04mk7O7+CYegzrzXN5uRLmoeVrxIzDJ1L8MKRLrR6hAQ4af8VuUyYOMebWwDTbOJwvLNG9XM6u1fYaXPo2r2dHB9sCo8tfApolexCAzOODzZJy/NSfwwqAagdoGblj0FGrZzDziNvFRur9hJFGgHY+4kbreLfzsvKC8COXZ5+Iqy8ANvVDa7JiYTBgAQCAOKT4yEWAZz/33Mi8re2uOESgOdtjBE0eWYLE2GecaKCSwB3yBsUl4dN3tknSIQoQms3Ye8QAIcAtXIOnd7A0+bHIkvcb5woCPKV8R+4dCHhyY0x/wAAAABJRU5ErkJggg==",
  house_blue:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAuZJREFUeJztmzFr20AUx/8O3gwFgwKixnQomAaKoBDTpjgeQtupU5Z8h1SL5syetbj9DoHSD9CEDGlKUlQImIKLoYMRLYIGCgXP6uCcK1k6+XyR/XSSfpN9T7p799fp7t35uYIAmm74KAg33qACAFVWoOmGrzcf0Hm0fvwbb1CpLr4u+3jumGtb9FCVF8Bzx7DtPtduWWaiCMoLwLAsE4+fvJx9/3Z9kigMIzcCANNOL8vGCvxQityMAJHhHkcuBPh8NZS+t/CvQIV9KFog5LljRAKhpIAir1SB6dM/am/BaNao/VkbA3eCngO/8HNAKQC1A9TMJkGjWcPei3uUvqyXUwBOQIC3X35g4OqEHq2XT788AOUrEA6Fe458SKka3UYdwG0kyM4C4yJBzx0nHiioamdB3wbw/4CwaERCYU1rxV7IK1fZHhoBRaYUgNoBakoBqB2gphSA2gFqSgGoHaCmFIDaAWpKAagdoKYUgNoBakLnAY9a0X3z++sTdJ6/5lagqp0lU4QE+D4axVbCK8+DPXQUFpcn2G3Ucf7zD7cCVe3sGDAiwFF7i1tZXug5w5kAhZ8EI6fBmm747Mw8aWipRrBPwVPw2ByhN08fAgB23Ql6zlA6ASkLWJaJYO7D+YevIXvhXwHhLLHOzjRGaD97tTJnAMC5+phaXReXycsjIJkm9/vdnsxtC9k8PIuUXVyOYFnmwnttuz97SMuQ+TxByzKFBN88NKVGj5QAZ6d/ZW6TZpXtLS2AbfdxcDuzpvVzOqsrabU5mJu9gxzvb0u3Lb0KGM3anRpmHO9vk6bnFX4ZLAWgdoCazC+DjG6jjt370Sw2lu0lizICsP3JPEYzvlyUzAvAll2R62TIvACdnZZQ52TCYEABAQD5zomwEgGC/98LIvO3tlUjJIDIbozB6zyzJYmwTDtpISTAfMjLi8uTOh+8hidCGqH1PEl7CEBAgG6jjoE7iZTFcZchHtdOGvB8ZfwDdlcVM4YpSDsAAAAASUVORK5CYII=",
  house_green:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAutJREFUeJztmzFr20AUx/8Ohg4uKW4dMDVeWnAJFEEhpg0kHkJbOmfJd0i1aM7sWYvb75ClH6ANgaQpSVChIAoGQyaRYqhwodRbQR2cc2VLJ50vtp9O0m9JfO909+6v093T87kAH5Wq5iEjuH27AABFVlCpal6lfp/Oo6WjeW7fLhTjKyYf1xlwbXE3VXkBXGcA0+xw7YahR4qgvAAMw9Dx9Nmr8efv3z5FCsNIjQDAaNCzsrIAP5QiNTNAZLqHkQoBvlx0pa/N/CNQYP9kLRBynQECgVBUQJFWisDo7h8016HVS9T+LA3bGaJtwcv8GpALQO0ANeNFUKuXsPNyldKX5XIEwPIJ8O7yCrZTJfRouXz+0QeQPwKToXDbkg8pVaNVKwO4iQRZLjAsEnSdQWRCQVU7C/pWgP8JwqwRCIXvPHoQqFThlCtv98+ALJMLQO0ANbkA1A5QkwtA7QA1uQDUDlCTC0DtADW5ANQOUJMLQO0ANRP5gLuNv4EK1ycDPHlzj9uAsvaT0Z8JAf70wr8t55WnwT6RCgs7J9iqlXF6/YvbgKp2lgYMCHDQXOc2lhbaVncsQOYXwUA2uFLVPJYzj5paquEfkz8LHro6vH3+GACw7QzRtrrSB5CSgGHo8J99OP3wdcKe+UdA+JTY1mYDANB88XphzgCAdfFxbm2dnfdi60gdk/v5fkfmsljW9o8DZWfnPRiGHnutaXbGN2kWEn9O0DB0IcHX9nWp2SMlwPHRb5nLpFlkfzMLYJod7N2srPP6Op21FbXb7E2t3n4Odzek+5beBbR66VYdMw53N0iP52V+G8wFoHaAmsRvg4xWrYzth8FTbOy0lyzKCMDeT6bR6uHloiReALbtitSTIfECbG02hAYnEwYDCggAyA9OhIUI4P/9nh+Zn7UtGiEBRN7GGLzBM1uUCLP0My+EBJgOeXlxedTg/XV4IswjtJ4m6h0CEBCgVSvDdoaBsjBuM8XD+pkHPF8Z/wBnOw6FeIHKvQAAAABJRU5ErkJggg==",
  char1_walk:"data:image/png;base64,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",
  char1_idle:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABSVJREFUeJztWk1IW1kU/uy4m8UQSCBjGJEOtIglFDRMwJqABV0VhgzkuXDT7trZFIRuxFWgmxLajbgudGGEkVkVDCj1p/AkDkhwFi3IiKUS0dJVdzO8WdR7+37u/31RlHcgkPfyvvt97+T+nnN6wLB0Nu+x7p922j2s+3GbLb8OvpcFvnHzNq9tT0WEzQvY8uviAw6QgHH2m1CEzQvY8pvgr3GfNjAVAbzecVHGdMDb2l2le90yW34dfGQOMCFkYUfnVqX3ZG3YmCqe9oB0Nu+dLM0AAG49fIVbD1/Rh/zXJ0szSt34be1u4CMzW35TPHMI7C1M4/jTMb0+/nSMvYXprr6ALb8png6B0067J1Ote43KCP1xbXE98HBtqBeZal26nO0tTCNTrQcEnCzNCIeALb8pPjIHOMs7aODrP0XsZKqMtcV1OMs7XXsB0oazDE/EL3O+rn7qANKFD/onMfObg/aHL8j/9D0AoP3hCzaPOmi5TQwcriBTrXPXYlMHEg0ttynkLxQnmNym+q/5wWuL6ygUJ2ij1588xfUnT+l1oTiBtcV15jgmbbTcJua39/Hi2Wsc9E/ioH8SL569xvz2PlpuUzqJyfhF3Cb6A5Pg+FQZADDWlw3ro/fIMyIBPDzPgX68jJ/3B5jqp10p3GDxVwff3RkGAPy39RfcPxsBoL8b+lcAMvnx8P7nSBu2eBv9zLFEJjIyZv3Xon04+S7ChwXEhbfVH2kk3EV19vCXCc/dChOgKqnfwl42jSPYHpxU8Ek8QAOcxANkdmXiAcD5nv+7wa+Kj8wBcb247vk/Ln5dPHMVIEfXH9I/dl1A3Py6eOYQ8J+fVQMaYQH+eICu2fLr4CMOCB9h/dfv3+0qLWU2L2DLr4vnHiv9Njq3qkROtqHO8g4NgNSGejE+VdZqw5TfBC/c1zcqI5jf3sfGx88A1DcyNi9gy2+NT2fz3j8HHe/5PcerDJc9cm2yF68Ml2kbqvgwvy1epl+4Edr4+BmNyggGDldUuKmAltvEbGGQttFym8p4lgZTvIp+pgMeb+3ijXMfADsAIjOCN3FgnHjATD/S2by3+uiBt/rogVb3C+PT2bznbbz0vI2X2kMoDryKfuHBBIjvKKvbTlx4GU4a3bERYWpJfUASDzDjT+IBBharAy6jJQ4gX1h7eJap1gfomi2/KT62HnDRDjQ16oCz9DZqQ/xUgWp9gInZ8pvimekpkkqa+/tfCgS+pZpkaSmCYwmQpaf8qS0Wvwyrqz+S4CT5dXKGJlbKpVD/o0Hy60whcTiQ1Afw+AvFCS63if5AdpYUMZRyKYz1ZbF51AEA+p2czsanyszsrI0DCT5TrQv5yTMsbhP9zPoAANg86mCsLxtoKPwMSwApUCjlUpgtDGK2MIhSLgWAX2ARrg8Q8avUB+joT+oDELKkPgCXK79vi0/qA1igJB7AsSQeILErGw+4yrUCwkmQ1UimumskwKRWIC5+EV7JASTVrVOyrirgPPhFeGGJDBEdrr83EaBbL2DLr4oPOOC00+55/+7bPyTKtcclIE5+E3xkCJwtEd7o3NeXGD+7zzqF8bBkJTBxoA2/CV64ry/lUvj9l5+l53gW/sbN25HZVzWaFAe/DZ7m2EmO//k9R6tGwKY+gIU34VfVz50EBw5X0KiMRAIbqtZymxQ7WxhEy21qbYL8eBNT1S/cCJHgwRvnPh5v6S1ffgEXgQfs9NNu6M+z62D9ef3zxuvoV56QLiq/b4oPt8PD/w9nCtlWg1vnygAAAABJRU5ErkJggg==",
  char2_walk:"data:image/png;base64,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",
  char3_walk:"data:image/png;base64,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",
  char5_walk:"data:image/png;base64,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",
  chicken:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAQCAYAAAB3AH1ZAAAAAXNSR0IArs4c6QAAAORJREFUSIljYBgFo2AUDDBgpLUFIhJ6/2HsNy8uYdjHQqkBhPRe0uVmYGBgYNC7/BWrGrwOIMYAQuDn7PUMYvIMDKcfMjCYWrj9Z2BA9QjBECBkALqDkfmnT+xiEJNnYPD26mbY73CA4XUhK4No/28UPYykGMDAwMAg2v8brwNgetDBR7dABr3LX/FHo4iE3v/7D178//ofEz9ztfyP7kBs+pH1IJuFSy8TugCy6189RLAJup4BEjXykm4Mrx5C9MLMQjaHIICFArLr7z/A7QNcZsDw/05jvHrxJibkRENqFiQWAAChbqnpVcPx8AAAAABJRU5ErkJggg==",
  door_open:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAS9JREFUaIHtl7FqwlAUhv+KW6EgOASLk6sECkKmdCj2BVz6EL5MF+fMLr6Am5k6FUJXp1KboeDUOZ0c2kTq/T3tIfB/Y8J/c77cw+UeQAghhBBCCC8umFA/iivrQgDgoyyC6+mGBvpRXC1nk9DYSTysUIVKBAscWDxtkQ4iNv6NfFdinoyoLC2QDiLEw0s2/gP+R3SMKnBDAt5IwBsJeCMBb1ovQF8lAOBuemVSRJF90llaIN+VQEZ/t7ZWPPznyxx7e2yCLR4gBaxap8YqPEIJPGbvTOxPaP0pRM/Et9c9bN72JkUc1mJmYnoH5skIFrPxcjY560BofQtJwBsJeCMBb1ovcNY8cIzxzX3j85fntfm3zHfgWPG/vWMxFTilQGsJuoWK1/oYyLRI0zohfAHeUDs9LTu8nAAAAABJRU5ErkJggg==",
  door_closed:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAALFJREFUOI1jYBjygJGBgYEhyNj+P7LgoafvGeykBRkIia07e5CRiVIXsMAYtlISKBLofHSxw89eMDAwMDAQ7YJDT99jFcdqAC7F2AALMqf19HUMdrWpJgMDAwNGAGI14PW1UBRJUa3VpLmAYfYGnAoPPX2PNWBRDBDt/40iiexsXF5ACUQ7aUG4QjtpQaw24nUBsgZiNGO4AAawRSOuqGVkYGBgEJHQ+49VlgB48+ISIwAbMy46tu+xVAAAAABJRU5ErkJggg==",
  fridge:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAN5JREFUSIljZGBgYBCR0PvPQAZ48+ISI4OIhN7/xcsP/f/6/wVJePHyQ/9FJPT+M4pI6P1/+HwXOQ5gkJd0Y2AiSycSGDUAasC6FbdI1gjTw4iciPr7pxClubAwB85mFJHQ+3/6xC4GMXnSXPDqIQODqYUbAwsDAwPDkeO3GBiOk2YADFAciCwwxtET1xl6J/ijOC8kPJvB2kKTOAOsLTQZ5CXd4BLEaEYxgIGB+FhABhSHAUo6CAnPJkrTmpVTUQ0Y2ulg4A0YTYmjBjAwQGPh6InrDAwMqLkMH0DOtQAzAH4sSQ6CDwAAAABJRU5ErkJggg==",
  furnace:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAWFJREFUSIntVLFKxTAUPX0UvyBDl9ItVCiFt4k6uHRzFPwIXd6XvEXHt7ztgcsDtwo6qLgVHgVLttLBDPmHOtSEpk3TuIpnCem9OT3n3psA//gD8OYSSJC2/b3gB+2MlYAEabte32nfVqtbjWThInOz3WOz3RtjTgRlkaMscmPMdyEY2vgVwdvHpzXu1IUgjAAAvKlHXXCqASEUhFBjzInABh8YD4tVzU+utOKTIG2TZYaYmiU+7O61/dX1DSrGUBZoBT94CwCTh6fQz7fWoGIMsgMAEIQRKsa0HOscxJSiAtQUmqz68k9TNmJKR7G+Cl8mnZ0c28SMIFUpBUNvrlA1KItcK9gUeFMjWWYAuplQBEEY4fz0cpbg9f1R5fOm1rvgaqMsciTLDLypx3PwfPFiXYHufZCdGRF8PR1Z1yE8eReEYJNXtg8hOpvybVA14E2trSbIwkn/QK+NqjUzKobxb0pFjCW05BFWAAAAAElFTkSuQmCC",
  sink:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAIpJREFUOI1jYBgFwwAw6pj6/i8vKsWQOHriOoO1hSYGGxl09nUzsMA4cxdtZNBQU4NLHjm2Ba7pyLEtKBpv3LrFkBznz8DAwMDARKkXWJA5N27dQpEMilCDOhVTDqsB6GDdCuyaiDJARESNYe6ijXA2LkC9MICFKqmAkYGBgUHH1Pc/OZqvnN7MCADqBiary1ayTgAAAABJRU5ErkJggg==",
  bin:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMFJREFUOI1jZEADIhJ6/9HFkMGbF5cYkfkoHBEJvf8h4dkM1haaWDUfPXGdYc3KqSiGsGDTDFOIDBAGZzOsWTn1P8wQJmRFuDQzMDAwrFk5leHoiesYrmPCphAXwCaHYQCpAMOAkPBsnIqxyaEYAPMjNoXIAYwMWJA5N27dYmBgYGAoL/RnKC/0xzCks38jXA1WA2CGdPZvxOoFdM0YXiAHDCcD3ry4xHjl/G6CGq6c3409MyEMYcCZndE1MzAwMAAAYvVZtXDuJqAAAAAASUVORK5CYII=",
  plant_g:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAblJREFUSIndlaFvwkAYxV8b3AiBBFFoJiZgwxQDEkga/BJYUo2Yx6PxKMxEdcX4CwgJTIJZDQzExNJBAgkLYa5JJ7or115bGjK1p46v3+99r0ev5UCpqDQtY7xCmMRaDq/aM0d+x8giLUhWPG/i/iEVarDQTaQFydptdA4AOALfPt7gTvoKhU8mSbw9vWO30TmuqDSteN6MDNMmx2UM/Ll7DpMxXoG/mP7VfzJY6MnIEN3LB12IAgPUk3hJEibBJeIB4LhkgpwVYZyzINZyiOfNyLAxXtlngRSjmtCwk4BWWpAssu6UCwCA7nTuXCcgEXPzpCEtSJZ0fWUXpywYaEAn8Kt7jXhvU6dcwLYvMwbbvoxOucAMiHnhdiuD0fDAGIyGB7RbGQBAdwrnleZKQGBlMGMMlMHMZcIkIFNoWP/4Zkw0lFy1v30fyPUEtMZpQnc6dz0DWqMEuZ4INuipa8bEC/fUtavu2oOXzw2g2pu5rbN/ZU9d2z1BBhNjby9UhnUGOD1+BlUxhYmxx8TYoyq6P3EEJD2+BqShkhWY6ZWswMQHqE3cbXTOG89PE2PvOg++x9kbPwgGgB/8JskOvUATOAAAAABJRU5ErkJggg==",
  plant_p:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAgCAYAAAAbifjMAAAAAXNSR0IArs4c6QAAAatJREFUSIndlC1swkAYht82OAgJCQkFMjUMpmaAA9EgZmZICJqAweHReBQzI9WEBDMzQRCd48dgMEMtHRBImhBwSzrRXXfXa1khU/vU8fV7nns5uAqgqpGqm4PjBOeqHMrh8e1JIJ/tRVSSzZfYA+5uP88K5qsA7rfP2G8Wgi3wC7tJhEaqbtaCMd8wLemdthB/+87nanCcQLya/q7/JJivAr4helb0euAHBgCOuCQJl+CaEgGgd9peDBLGvgvlUA61YMw3PDhOrLtAmn4lNGwnoCsqySZZt7JpAEB7urSfE5AUd+RkICrJpnwTtJpTHvQU0Anc+k6R6BxqZdPYdRVOsOsqaGXT3AYBJ9ysxjEeHTjBeHRAsxoHALSnMEkSJgGBK8MZJ6gMZ4yES0B2oeHF+4mT9JFhen/7PlCKYfRLPzu0p0vmP9AvZaAUw96CjrrmJE64o66ZPnMGrx8bQLUOc1fkf8qOurZmvASablgLlWPtDewZN0EhGYGmG9B0A4VkhBkkIJlxFZCBfELids8nJC4+QB3ifrMQnPHcStMN5j64XmdnfC8YAL4A+dfKKK7ho1YAAAAASUVORK5CYII=",
  npc1:"data:image/png;base64,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",
  npc2:"data:image/png;base64,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",
  npc3:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACgCAYAAADEkmT9AAAAAXNSR0IArs4c6QAACXpJREFUeJztncFLHFkex78GFxwYPNnEvYRmBnokBJlBZXv3IjaMcQ/SQxvsPodcTBgYFVayf8AEljEOBPGQXOYy2I7KggeNkg4GVgQVB2mC05BEZDe024bAkoOHgdpD9yurqqvaHqj3Xo3v+4FhrLLTv/d9v1+/elXt7/cDCCGEEEIIIYQQQgghhBBCCCGEEHLZaPE72dHZbfmdPy0f+L4+bGhfnf26N+zo7LZuZe/5vngxPyt9Emhfrf0rXuM3vvgy8MU3vvgyMDrDIEj8YamEw1IJt7L3pNuPgn6h14sM/a1hvlnYiEnoSiSU2exKJHBYKtXZFOeK+xtKxiBsOo9lcMV7QkyAF79JkYmwp9KmwM+mrnEE+SMsfFeArkQCcyNtrnNjS2omQNhVZe/3gNMfi/lw39teATo6u63KwiSA6qdv4MGB/aKBBwd2FFYWJqVeB732VOHU3wgV+r14/REmdZeAw1IJz+93u651xf0NPL/frcwpTntzI211q5EJCN1+/ggTOwBOywctsdFp17WuML+JwvymfdyVSCA2Oi31Vshrz3ksE6H/ImTrd1KY36zzR9j47gEK85twLoeVXH/V+B/+FPoAnJyWD1qyy3AtxalcP8aWzqTajSJjS2eYy/Xjp5r2ysKklOCr2wNMjaeRKsdwdO2mvQIcXbuJVDmGqfG09Gug+CTGRqcxNZ4Gvn+JqfE0FvOzskwCONff6DJ3WCop2QMs5mdd2sV8yFh5WoFz8YX5TWSXq8tgZQLAw28BAPGJGcS2VoHkKvKZXhGNlsylcGd7He/Sj9B3sorK8XVZZgC49Rf3dwHU3/Ydlkoo7m+gMP9eif748VPEtlaxlm7FzvY6+pKDUuy4LgGpXD+wvIu1q8PAkzbE78xUf/HkY6wNDGPoZKX6GgXE2x+j72QF+UyvfU72o1ih/7u3bej56LXrd3tv2zAkXiOJ0/JBy2J+1l5d8pleDC2voNIubxPcKgzHRqfdy9qdD56fq7EiNkrSN0I1+84Jl2XTq3/oZAVrGEbPp78CAPZetWLoZAWAfP2n5YMWcYkRAenyRcj4fhmU/CoLANj+Z/Wpg/NY5TdiUbALmKXfNu7c6HiPdY1Dl92ojIMQQgghhBBCCCGEEEIIIYQQQgghpBkiWR9ANybpj1x9ADEGv/OqbJuk3/VXwc3kxxf3IfXPoS9wgHTbpumvyw3Uie4CDbrRoT+y9QF0YZr+yNUHiEqFDlP0R7I+gHCA8z/Znz5T9UemPkBUHGCa/sjVB9DlAFP1R6Y+gMjPc94CeQsiqHCAsGuKfjsAxBJ0dO0m4hOvcXTtJl7/4+8AgE/+9i1S5Zf45GEacyNt0lOjdTjAaP0dnd2W9eIH69nd25bIR7MyU9abo7L15qhsWZkp+/yzu7ct68UPUnLWxDiE7Wd3b1vP7t623hyVpdqOgn7vGLz6rcyUFLuRrA9Q6KwgNTHjKlCxdnUYPTm5dwJR0J/K9WPtX39E3KO/0FlBSoI9exlzRtba1fPceIEzRx6Q81zaVartxvF5XvyTj7E3cGbbl2Vb/KxTv23/eZtLP4rXAIRfpCpy9QHEJFT+8lfX+djWKgD5XwiZpr/h18HCmPdYBc5PpOpCCTr1+wWgKtuEEEIIIYQQQgghhBBCCCGEEEIIuRywPoAPJulnfQAf2ybpd72hs3894N8xW/Yk6HSAifp96wM425arbOLsdICf3VvZe0rqA5ik3zc1TCA+Aapz4512nceqMUF/wwBwDkhW//qL7AL6izNcZv1NlYiR2b++GZz58jq4zPoDA0BV//pm0OEAU/Q3XAFU9K8PIgoOMEF/YACMLZ25EiErC5PILu8qfRii0wGm6PfdBC7mZ7GzvY6RkSyml/KI1VqXqxQ/tnSGuVw/flo6AwDRsl3JGIR+TMxg6uH4pdYfeBcQP36KF/95j3fpR1L71/shHBBLDtr/B9Q6IH78FLGtVaylW5Xqt4MPUBKArktArX+9fZzP9GLoZAXx9sdh272Q+PFTAEBfLQhUEAX9lYVJ9CUH8S79CHuvWhGfmMHO9jrymV4pD8Hq9gDOKLOvgRL713ttCwfsfV1CZWES+UyvUgfo1C8QgSeQqT9wSdHRv95pc+W//wO+uV79xfcvEdtaVZ6erkO/KJARG512FaqQpb/hG6quCxCUG5/47HMAQOmXn7XUKFBt06kXUF8fgRBCCCGEEEIIIYQQQgghhBBCCCG/b1gfwAeT9LM+gI9tk/S7/iy8mfblxX1I7Zl3gQOk2zZNf1PJoapoxgEq6gPoQof+ugAQhRG86E7RVoVp+gMrhDRzTgZRcIBJ+u0AcDVtbIDs9u2AHgeYqj8ye4AoOUAHuvTbAVBrX37hP1CVoasaU/VHZgUw1QECXfrr9gCNyqIdlkqXfgk2Tf8V4Fx8YX4Txf2NwF1ocX8DhflNqZOgwwFR0N9sAIaN60lgKtcPLO/iu7dt6PnoteuFe2/bMAS4yqaEiZgAsQx6d73CAUC3FPuAXv0CUQsoSH9tjkJ7Imi/iTeinanJe69aXfnqQPjPpb2p0d726c4xyNgD6NbvHIPTtiC2tQrn/IQeAM5BeFO0VaUnO50Q5ADZG0Cd+oV9oHEAhjmGhl8HC0O68uTFzzoKNQB69AfVSLiMdz6EEEIIIYQQQgghhBBCCCGEEEIIkQPrA/hgkn7WB/CxbZJ+1xsGiXd2sZY9CTodYKL+ht3DVbdvv8gBt7L3pBeJ8LN7mfUHBkAU8uFVO8Br2wT9dQEgWpSPLekXr8MBpun3XQFEq3JTHWCSft/s4OL+Bp7f78ZhqWS3MVfJwIMDKXlwzWKS/roAcLYo70oklLZsF+h0gGn665pHZ5d34axUkcr1Y6zWwlwFOh1gov66PUCtUIEFADvb6xgZyWJ6KY++5CCC7k/DouoAWDod4NUvWrhfVv2Bt4E72+t4l36EFyfv7VbuKvA6IFZrH6/CAU6E/r6TVVSOryuzGxSAANCXHAzdXmCJmHj7YwydrCCf6bXPqXoUCsB2OgClASjQpb+js9vKZ3qxs72O+MQM9l61VgMxOYhmikj9VoKfBN75AMBdEEHllyHx9sfIZ3qRyvVj7+vqjlhlAEZBv8AbiGHiGwCn5YOW2Bas5FdZDP/4bz1ty+98QOqb6uT3fPorkn8WKdNya/UCevXb+4ByzHVeVmWShqJ01QVIfPY5AKD0y8/2edU1AsRYAPX6vfUBnPMR9lj+D+MX6Y5zuWJYAAAAAElFTkSuQmCC",
  worktop:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAAwCAYAAADJuP4nAAAAAXNSR0IArs4c6QAAAiNJREFUeJztm7FOwlAUhv8aB3VrQpMGJhMXFiYd4SEY4CVYGkdnRuLiQ6hDF3cTYESXLiwmTpgmNOmmbjiYkiKicO+R0yPn22hyem75cm9pf64DAkp+bUZxnm2TxJHDPXabMSRx5Di2Ayj5tdn09tz2NCx4rR4AgGv8tv29Vg97lANSto8KFI4KFI4KFI4KFI4KFI4KFI4KFM4+Z3Ov1cNN89TqHO3wwfpB/P66b1XPic5A4bDOQOBzBmU0Ku5aNYNJStY/iSOnHWJG0X/Teop3sewCGxUXg0mKi7Pq/NjwJcZgkuLy8goAEAQdNCou6mUfAFAv++iOxvNaCkz7AzAePwXsAgGg6h4sfM4uNAg6ALBw8atqOPub1g9j+7EXQuA4fV86Vi/7Sxf9tcY7OixEf9N6CtgFho99BwCCu2jz2tg+i8zqTZa0/PJtUk+RRbILLALceaAN+hghHBUoHBUoHBUoHBUoHBUoHBUoHH0OLAA2cZYKhOw8UAUyYxNnJXHk7LxA7jwwO5aPo34jH0ftvMAMky9wVR64bj0F+isUZtniT3ngX/X8DhUIs2wuX2NbbwPr9jKKOAWw256Vvw9JhPUeKHVfYZHQJVQ4KlA4KlA4KlA4KlA4KlA4KlA4KlA4JA/ykvM06egMFA7Je8DsP/7bztNs66W/BwUIBW6ShwFA+PQ8390zfX1D8+R4q/Xd0fhfCNQlVDhsAinzNKpsTSIfMJoBRcqrY0oAAAAASUVORK5CYII=",
  window:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAK9JREFUOI1jYBhowAhjiEjo/SdF45sXlxgZGBgYWGCaX09zIslm0SyG/29eXGJkgQns2/OJJANggAWZE77uDMOb2t0MOsE8DFfWfsGqQaTZlWFlkAmcz4RN0ZW1Xxh0gnngfGQ2OsBqAMwQXAbiNQBdIYyPyxAMA9AVorsEHbCgC4g0uzK8aGZgEMHqYEyAYoCdtCCDrZQEXg2Hn73AbUC2uTJBG/VkUdVQnJQHHgAACbg2yM7sLZgAAAAASUVORK5CYII=",
  table:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAwCAYAAACG5f33AAAAAXNSR0IArs4c6QAAAqhJREFUaIHtmrFq3DAYx/8uJrQ9KKR1iJuSB8jiqR2TIfQJuhxk69os3TvfIySPUOhyT2AyOFNwJi9H5+Lgow6GQCCbO9zJ6FxLsq07WafoNxl/sr6/Pkv6JFsODMHzg1KVrzxLHHLtqnK6STw/KH98Omq0TeIZ1m9DSYL4oo9gnfHOznF9l7WynXzY7fUcjdN4d8vg9cDruwzHB/5abZN4BmN7oGqedQCjtJCuw/gA9g1S2+e2fg70/KD89eUjTj+/UebzKnzAeHqLPEscI5YxyZ9HIFTsb4kRAQwOR0p7IEIA8eLS+Dlw09gASmIDKIkNoCQ2gJLYAEpiAyhJq3Wgyo+VNPSHS11xAXGA/l6e4ip8ULZYJb72voGrS4cAu7xvaUMj0jWJ+QFWgZ0DJakC6J2dD6mjEzpprQKY/7wYUkcndNJqh7AkLrD4SQKs/qUiRGmB71/fq1W1ZBLPmJp0wQX42Y71Z0oFLF1EE3nxQ2KHsCQ2C0tis7AkdghLUmVhXrYbMgsD7NWBDnCz8JAZGBCvDmwWNgCbhSWpPqjqlNlE1LXakwmSDHkywYi98Hh6i5Ob/8uRsk11yNoIRuyF99/t4/jgLbMeVhuitOC2j2X7/bSD+f0cwDPPwqwe1gWbhSUxbi/c97R9X9vWD+E8SxwyHwGL4NJzFz3h120r9XR4bn4/r36pugCY0SUE4UjpWov4Eumi4ZVl2UT76Tb+3XpFR7svVwrMiicMNeNEadGoh1WWQJ4hZXn1tLWx/Lp5ljieH5SsjLT3+lXjfRU0aSJ6orSohhGrDTztXW1NfoFlD8yzxInAPt5BeiC9hVEBb4jVj3WI2rAu6n5XtnLkDdJRJudmgsPRprU1Quug9bFoaoMMIr/CvXCeJc54OswZFB0OD4n4B/9WdY/gZ0CPAAAAAElFTkSuQmCC",
  chair:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAAAXNSR0IArs4c6QAAAiVJREFUeJztmjtqw0AQhn8ZFX5AQCCDQKRKZQiqElJFEJMTpPEd4iOkSZMjOHdIoxMYF+qMXblx5SoIDDYIAnl0SuHIkh+yV3hX66znqyx5tDv/atmZnRVAEARBEARBEARBEARBEARBKI5mWk4UX8ynI02GE3l8kOWvyH5l6tcB4O3hCgDQ8hAVPQlMy4mS/ocrArMo2t91H0W2XbR+/ZCHRTB7be78v/7YK8gTORStXweATn/CtdG8pPvvdT9y2ReFyD5l6tcBYPb1jXH4w63RvPhBiIZRZraX4W9eH0W2zVO/DgDPd5cA2GMQ77jr2gYAMIuqVyuoVyvwg/Dgvln0Aum4yzcHAOTq1wGgeX+2uPISoVmIGADZsGhOj5FKlGQ7QMhlYxfQ8obLJSmNH4Rb76tApz/J1MdjmT1mdGB1a/F03YBzXtswbEPN5R9YvOSsMHD7/omXwVjZ7edaIWgI57yWxLt1PHnVQlHMpyPNtJwoU3MXwEBsEigTygFOnKMoBP0HVB2joygEtW8uFj/6k+zw84fbN5b2foHLschCkExKwKKwoGqGzwvXNlCvVmS7wZ2t28BdxQ7Tcgo/MRRJXAlUNcvfx8YEoErgJipqjjmK4+A4wWIpuvhBCCiakMlgZQK4tiE922U5DuXNPs0q50eaaTlRwygz7QJiO5GfROWBhx+nrl+fT0faGMkgbGs0PUiiEkDXNuAHIdM3cbEtD05d/y+DOT3Ggf4/lgAAAABJRU5ErkJggg==",
};
G._imgCache={};
G.loadImg=src=>{if(G._imgCache[src])return G._imgCache[src];const i=new Image();i.src=src;G._imgCache[src]=i;return i};





// ICON PIXEL ART 8x8 tự vẽ bằng chuỗi ký tự. Mỗi ký tự = 1 màu trong bảng P. Tự thêm viền tối.
(()=>{
const P={k:'#2a1a10',w:'#fff3d6',y:'#f2b632',g:'#6fb04e',G:'#3f8a3a',b:'#8b5a2b',B:'#5a3a20',r:'#c8462e',p:'#f1c9a0',c:'#e8d27a',e:'#fffaf0',o:'#e8892a',d:'#d9a066',s:'#8fc8e0',n:'#6b4a30'};
const S={
 nep:['......cc','.....ccc','....ccc.','...ccc..','..cc.G..','....G...','....G...','....G...'],
 dau_xanh:['......GG','.....GgG','....GggG','...GggG.','..GggG..','.GggG...','GggG....','.GG.....'],
 hanh:['..g...g.','..g...g.','.gg..gg.','.gGg.gG.','..GgGg..','...GG...','...ee...','...ee...'],
 dua:['..bbbb..','.bbbbbb.','bbwbbbbb','bwbbbbBb','bbbbbbbb','bbBbbbbb','.bbbbbb.','..bbbb..'],
 trung:['...ee...','..eeee..','.eeeeee.','.eeeeee.','.eeeeee.','.eeepee.','..eppe..','...ee...'],
 sua:['..nnnn..','...ww...','..wwww..','..wwww..','..ssss..','..wwww..','..wwww..','..wwww..'],
 cam:['..yyyy..','.yyyyyy.','..bbbb..','.bbbbbb.','bbybybbb','bbbbbbbb','bybbybyb','.bbbbbb.'],
 duong:['........','..wwww..','.wwwwws.','wwwwwwss','wwwwwsss','wwwwsss.','.ssss...','........'],
 muoi:['..bbbb..','..bwbw..','..wwww..','.wwwwww.','.wsswww.','.wwwwww.','.wwwwww.','..wwww..'],
 seed:['........','...yy...','..yyyy..','.yyoyy..','.yyyyy..','..yyy...','...y....','........'],
 bowl:['........','.aaaaaa.','eeeeeeee','rrrrrrrr','.rrrrrr.','.rrrrrr.','..rrrr..','........'],
 flan:['........','..bbbb..','.bbbbbb.','.yyyyyy.','.yyyyyy.','.yyyyyy.','wwwwwwww','........'],
 ga:['....r...','...eee..','..eeeeo.','.eeeee..','eeeeee..','eeeee...','..o.o...','........'],
 bo:['n......n','nddddddn','.dddddd.','dkddddkd','.dddddd.','..pppp..','..pkkp..','..pppp..'],
 coin:['..yyyy..','.yooooy.','yoyyyyoy','yoyooyoy','yoyooyoy','yoyyyyoy','.yooooy.','..yyyy..'],
 sun:['...y....','y..y..y.','.yyyyy..','.yyyyy.y','yyyyyyy.','.yyyyy..','y..y..y.','...y....'],
 face:['..BBBB..','.BBBBBB.','.pppppp.','.pkppkp.','.pppppp.','..prrp..','.rrrrrr.','.rrrrrr.'],
 // Balo to rõ hơn
 balo:['.BB..BB.','.BBBBBB.','BByyyyBB','ByeeeeBy','ByeyyeBy','ByeeeeBy','BByyyyBB','.BBBBBB.']
};
const tint={xoi_dau:'#9ac45a',xoi_man:'#d98a3a',xoi_dua:'#fff8e8'};
const cache={};
function make(rows,over={}){const c=document.createElement('canvas');c.width=c.height=10;const x=c.getContext('2d');
 const px=(i,j)=>rows[j]&&rows[j].padEnd(8,'.')[i];const f=(i,j)=>{const k=px(i,j);return k&&k!=='.'};
 for(let j=-1;j<9;j++)for(let i=-1;i<9;i++){
  if(f(i,j)){x.fillStyle=over[px(i,j)]||P[px(i,j)]||'#f0f';x.fillRect(i+1,j+1,1,1)}
  else if(f(i+1,j)||f(i-1,j)||f(i,j+1)||f(i,j-1)){x.fillStyle=P.k;x.fillRect(i+1,j+1,1,1)}}
 return c.toDataURL()}
G.iconUrl=id=>cache[id]||(cache[id]=
 id.startsWith('hat_')?make(S.seed,{y:G.CROPS[id.slice(4)].color}):
 tint[id]?make(S.bowl,{a:tint[id]}):S[id]?make(S[id]):id==='flan'?make(S.flan):make(S.face));
G.ic=id=>`<img class="ic" alt="" src="${G.iconUrl(id)}">`;
G.fillIcons=root=>root.querySelectorAll('[data-ic]').forEach(e=>e.innerHTML=G.ic(e.dataset.ic));
})();

// SPRITE PIXEL ART CHIBI (đầu to, dễ thương, style Tiny Farm + làng Việt)
(()=>{
const P={k:'#2a1a10',g:'#7bc653',G:'#4a9a3c',H:'#2f6a2e',y:'#f2d04a',Y:'#d9a82a',b:'#8b5a2b',B:'#5a3a20',n:'#b07a3a',d:'#e8cf8a',e:'#fffaf0',E:'#d9cfb8',r:'#c8462e',p:'#f1c9a0',o:'#e8892a',s:'#8fc8e0',c:'#3b6ea5',w:'#fff',R:'#e85a4a',m:'#c47a2e',a:'#6eb5e0',f:'#f0a0b8'};
function mk(rows,over={}){const w=Math.max(...rows.map(r=>r.length)),h=rows.length,c=document.createElement('canvas');c.width=w+2;c.height=h+2;const x=c.getContext('2d');
 const q=(i,j)=>(rows[j]||'')[i]||'.',f=(i,j)=>q(i,j)!=='.';
 for(let j=-1;j<=h;j++)for(let i=-1;i<=w;i++){
  if(f(i,j)){x.fillStyle=over[q(i,j)]||P[q(i,j)]||'#f0f';x.fillRect(i+1,j+1,1,1)}
  else if(f(i+1,j)||f(i-1,j)||f(i,j+1)||f(i,j-1)){x.fillStyle=P.k;x.fillRect(i+1,j+1,1,1)}}
 return c}
const CUST1=['...eeee...','..eeeeee..','.eeeeeeee.','..pkppkp..','..pppppp..','..prrrp...','...cccc...','..cccccc..','.pccccccp.','..cccccc..','..BB..BB..','..BB..BB..'];
const CUST2=['...eeee...','..eeeeee..','.eeeeeeee.','..pkppkp..','..pppppp..','...rrr....','...aaaa...','..aaaaaa..','.paaaaaap.','..aaaaaa..','..BB..BB..','..BB..BB..'];
const CUST3=['...eeee...','..eeeeee..','.eeeeeeee.','..pkppkp..','..pppppp..','..prrrp...','...mmmm...','..mmmmmm..','.pmmmmmmp.','..mmmmmm..','..BB..BB..','..BB..BB..'];
const CUST4=['...eeee...','..eeeeee..','.eeeeeeee.','..pkppkp..','..pppppp..','...rrr....','...ffff...','..ffffff..','.pffffffp.','..ffffff..','..BB..BB..','..BB..BB..'];
G.SP={
 sprout:mk(['............','............','....g..g....','...gG..Gg...','....gGGg....','.....GG.....','.....G......','.....G......']),
 grow:mk(['............','..g......g..','..gG....Gg..','...gG..Gg...','....gGGg....','..g..GG..g..','..gG.GG.Gg..','...gGGGGg...','.....GG.....','.....GG.....','.....GH.....','.....H......']),
 nep:mk(['........yy..','.......yYy..','..yy..yYy...','.yYy.yYy.yy.','.yYyyYy.yYy.','..yYYy..yYy.','...GyY.GyY..','...GG.GG.G..','....GGG.G...','....GGGG....','.....GG.....','.....GG.....','.....GH.....','.....H......']),
 dau_xanh:mk(['....g..g....','..g.gG.Gg.g.','.gGgGGGGgGGg','.GGHGGGGHGGG','.gGGHGGGHGGg','..GGHGGHGGG.','.gGGGGGGGGg.','..GGHGGHGG..','...GGGGGG...','....GGGG....','.....GG.....','.....GH.....','.....H......']),
 hanh:mk(['..g.....g...','..g..g..g...','.gG..g.gG...','.gG.gG.gG.g.','.gGgGG.Gg.g.','gGgGGGgGGgG.','gGGGGGGGGGG.','HGGGGGGGGGH.','.GGGGGGGGG..','..eGGeGGe...','..eeeeeee...','..eEeEeEe...','...BBBBB....']),
 dua:mk(['..G..gg..G..','.GgG.gG.GgG.','GgGGgGGgGGgG','.GGGgbbgGGG.','...gbwbbg...','....bbbb....','.....nB.....','.....nB.....','.....nB.....','.....nB.....','.....nB.....','....nnBB....']),
 ga:mk(['......r...','.....eee..','....eekeo.','..eeeeeeo.','.eeeeeeee.','.eEeeeee..','..eEEEe...','...o.o....','..oo.oo...']),
 bo:mk(['................','..eeeeeeeee.nn..','.eeBBeeeeeeenn..','.eeBBeeeBBeeeee.','.eeeeeeeBBeeeke.','.eeeeeeeeeeeepp.','.eEeeeeeeeEeepp.','..ee.eeee.ee.pp.','..BB.BBBB.BB....','..BB......BB....']),
 // Nhà bếp nâng cấp (ngói đỏ, tường vàng, 2 cửa sổ, hiên)
 house:mk([
  '........rrr........','.......rrrrr.......','......rrrrrrr......','.....rrrrrrrrr.....','....rrrrrrrrrrr....','...rrrrrrrrrrrrr...','..rrrrrrrrrrrrrrr..','.rrrrrrrrrrrrrrrrr.','rrrrrrrrrrrrrrrrrrr',
  'BBBBBBBBBBBBBBBBBBB','B.yyyyyyyyyyyyyyy.B','B.yyyyyyyyyyyyyyy.B','B.yyyBBByyyyyBBBy.B','B.yyBwwwByyyBwwwB.B','B.yyBwwwByyyBwwwB.B','B.yyyyyyyyyyyyyyy.B','B.yyyyyyyyyyyyyyy.B',
  'BBBBBBBBBBBBBBBBBBB','..BB...........BB..','..BB...........BB..','..BB...........BB..'
 ]),
 tree:mk(['......gg......','....ggGGgg....','...gGGGGGG....','..gGGHGGHGG...','..GGHGGGGHG...','...GHGGGGH....','....GGGGGG....','.....GGGG.....','......nn......','......nn......','......nn......','.....nnnn.....']),
 tree2:mk(['.....ggg......','....gGGGg.....','...gGGHGGg....','..gGHGGGHGg...','..GGHGGHGGG...','...GGGGGGG....','....GGGGG.....','.....nnn......','......nn......','......nn......','.....nnnn.....']),
 bush:mk(['..g.g.g..','.gGgGgGg.','gGGGGGGgG','.GGHGGHG.','..GGGGG..']),
 flower:mk(['...r.r...','..rrrrr..','...rYr...','....G....','....G....','....H....']),
 flower2:mk(['...y.y...','..yyyyy..','...yYy...','....G....','....G....','....H....']),
 flower3:mk(['...o.o...','..ooooo..','...oYo...','....G....','....G....','....H....']),
 barrel:mk(['.BBBBBB.','.BwwwwB.','.BwwwwB.','BBBBBBBB','.BwwwwB.','.BwwwwB.','.BBBBBB.']),
 cust:[mk(CUST1,{c:'#3b6ea5'}),mk(CUST2,{c:'#6eb5e0'}),mk(CUST3,{c:'#c47a2e'}),mk(CUST4,{c:'#e85a7a'})]
};
})();

// TRẠNG THÁI + LƯU GAME (localStorage)
G.KEY='xoiBenDua';
G.fresh=()=>({money:G.CFG.startMoney,day:1,clock:0,inv:{hat_nep:5,hat_hanh:3,hat_dau_xanh:2},
  hotbar:Array(8).fill(null),plots:Array(G.CFG.plots).fill(null),animals:[],cooking:[],customers:[],spawn:0,served:0});
G.S=(()=>{try{return JSON.parse(localStorage[G.KEY])}catch(e){return G.fresh()}})();
if(!Array.isArray(G.S.hotbar))G.S.hotbar=Array(8).fill(null);
while(G.S.plots.length<G.CFG.plots)G.S.plots.push(null);
if(G.S.plots.length>G.CFG.plots)G.S.plots=G.S.plots.slice(0,G.CFG.plots); // migrate if reduced
G.ui={zone:'farm',seed:'nep',held:null,modal:null,sel:null,hotbar:G.S.hotbar};
// Trang bị nhanh 8 ô (Stardew-style)
G.hold=id=>{
  if(!id){G.ui.held=null;return}
  // Bấm lại ô đang chọn → bỏ tay (chỉ 1 ô được chọn)
  if(G.ui.held===id){G.ui.held=null;G.msg('Bỏ tay');return}
  if(!G.has(id)&&!id.startsWith('hat_')){G.ui.held=null;return}
  G.ui.held=id;
  if(id.startsWith('hat_'))G.ui.seed=id.slice(4);
  G.msg('Đang cầm: '+(G.ITEMS[id]?.n||id));
};
G.unhold=()=>{G.ui.held=null};
// Gắn vật phẩm vào ô nhanh i. Nếu vật phẩm đang ở ô khác thì 2 ô hoán đổi; ô đích có đồ khác thì đồ đó rời thanh nhanh (vẫn còn trong túi).
G.putHot=(i,id)=>{const hb=G.ui.hotbar,j=hb.indexOf(id),old=hb[i];
  if(j===i){G.msg('Đã ở ô '+(i+1));return}
  if(j>=0){hb[j]=old;hb[i]=id;G.msg(old?`Hoán đổi ô ${j+1} ↔ ô ${i+1}`:`Chuyển sang ô ${i+1}`)}
  else{hb[i]=id;G.msg(`Gắn ô ${i+1}: ${G.ITEMS[id]?.n||id}`)}};
G.setHot=i=>{const id=G.ui.hotbar[i];if(id)G.hold(id);else G.unhold()};
// Tự xếp vật phẩm vào hotbar khi nhặt (ô trống)
G.fillHot=()=>{
  const hb=G.ui.hotbar;
  Object.keys(G.S.inv).forEach(id=>{
    if(hb.includes(id))return;
    const empty=hb.findIndex(x=>!x);
    if(empty>=0)hb[empty]=id;
  });
};
G.save=()=>{try{localStorage[G.KEY]=JSON.stringify(G.S)}catch(e){}};
G.reset=()=>{G.S=G.fresh();G.ui.hotbar=G.S.hotbar;G.ui.held=null;G.ui.sel=null;G.save()};
G.has=(id,n=1)=>(G.S.inv[id]||0)>=n;
G.add=(id,n=1)=>{G.S.inv[id]=(G.S.inv[id]||0)+n;if(G.S.inv[id]<=0)delete G.S.inv[id]};

// TRỒNG TRỌT + CHĂN NUÔI
G.plotClick=i=>{const p=G.S.plots[i],k=G.ui.seed;
  if(!p){ if(!G.has('hat_'+k))return G.msg('Hết hạt '+G.CROPS[k].n+' — ra Chợ mua nhé');
    G.add('hat_'+k,-1);G.S.plots[i]={crop:k,t:0};}
  else if(p.t>=G.CROPS[p.crop].time){G.add(p.crop,1+(Math.random()<.3?1:0));G.S.plots[i]=null;}};
G.buyAnimal=t=>{const a=G.ANIMALS[t];
  if(G.S.animals.length>=G.CFG.maxAnimals)return G.msg('Chuồng đã đầy');
  if(G.S.money<a.cost)return G.msg('Không đủ tiền');
  G.S.money-=a.cost;G.S.animals.push({type:t,fed:false,t:0,ready:false});};
G.feed=i=>{const a=G.S.animals[i];if(a.fed||a.ready)return;
  if(!G.has('cam'))return G.msg('Hết cám — ra Chợ mua nhé');G.add('cam',-1);a.fed=true;a.t=0;};
G.collect=i=>{const a=G.S.animals[i];if(!a.ready)return;
  G.add(G.ANIMALS[a.type].make);a.ready=false;a.fed=false;a.t=0;};
G.updateFarm=dt=>{
  G.S.plots.forEach(p=>{if(p)p.t=Math.min(p.t+dt,G.CROPS[p.crop].time)});
  G.S.animals.forEach(a=>{if(a.fed&&!a.ready){a.t+=dt;if(a.t>=G.ANIMALS[a.type].time)a.ready=true}});};

// MUA / BÁN
G.buy=id=>{const p=G.ITEMS[id].buy;if(G.S.money<p)return G.msg('Không đủ tiền');G.S.money-=p;G.add(id)};
G.sell=(id,all)=>{const n=all?G.S.inv[id]:1;if(!G.has(id))return;G.S.money+=G.ITEMS[id].sell*n;G.add(id,-n)};
G.msgText='';G.msg=t=>{G.msgText=t;clearTimeout(G._m);G._m=setTimeout(()=>G.msgText='',2500)};

// NẤU ĂN + KHÁCH HÀNG
G.canCook=r=>Object.entries(G.RECIPES[r].need).every(([k,n])=>G.has(k,n));
G.cook=r=>{if(!G.canCook(r))return G.msg('Thiếu nguyên liệu');if(G.S.cooking.length>=3)return G.msg('Bếp đang bận (tối đa 3 mẻ)');
  for(const[k,n]of Object.entries(G.RECIPES[r].need))G.add(k,-n);G.S.cooking.push({r,t:0})};
G.serve=i=>{const c=G.S.customers[i],r=G.RECIPES[c.want];
  if(!G.has(c.want))return G.msg('Chưa có '+r.n);
  const tip=c.p/G.CFG.patience>.5?1.2:1; // khách còn kiên nhẫn → boa
  G.add(c.want,-1);G.S.money+=Math.round(r.price*tip);G.S.customers.splice(i,1);G.S.served++};
G.updateKitchen=dt=>{const S=G.S,q=S.cooking[0];
  if(q){q.t+=dt;if(q.t>=G.RECIPES[q.r].time){G.add(q.r);S.cooking.shift()}}
  S.spawn+=dt;
  if(S.spawn>=G.CFG.customerEvery&&S.customers.length<G.CFG.maxCustomers){S.spawn=0;
    const ks=Object.keys(G.RECIPES);S.customers.push({want:ks[Math.random()*ks.length|0],p:G.CFG.patience})}
  S.customers.forEach(c=>c.p-=dt);S.customers=S.customers.filter(c=>c.p>0);
  S.clock+=dt;if(S.clock>=120){S.clock=0;S.day++}};

// ENGINE VẼ: canvas 384x216 (16:9), hàm vẽ, vùng chạm (hotspot). Từng khu nằm trong zones.js
const W=384,H=216,cv=document.getElementById('cv'),cx=cv.getContext('2d');cx.imageSmoothingEnabled=false;
G.cam={x:0,y:0}; // camera offset (world space)
const R=(x,y,w,h,c)=>{cx.fillStyle=c;cx.fillRect(x|0,y|0,w|0,h|0)};
const D=(s,x,y,k=1,fl)=>{const w=s.width*k,h=s.height*k;if(fl){cx.save();cx.translate((x|0)+w,y|0);cx.scale(-1,1);cx.drawImage(s,0,0,w,h);cx.restore()}else cx.drawImage(s,x|0,y|0,w,h)};
const hs=(x,y)=>((x*73856093)^(y*19349663))>>>0;
const imgs={};
const IM=(id,x,y,s=16,a=1)=>{const i=imgs[id]||(imgs[id]=Object.assign(new Image(),{src:G.iconUrl(id)}));if(i.complete){cx.globalAlpha=a;cx.drawImage(i,x|0,y|0,s,s);cx.globalAlpha=1}};
const T=(s,x,y,c='#2a1a10',z=8,al='center')=>{cx.font='700 '+z+'px "Be Vietnam Pro",sans-serif';cx.fillStyle=c;cx.textAlign=al;cx.fillText(s,x,y)};
const TS=(s,x,y,c,z,al)=>{T(s,x+1,y+1,'#2a1a10',z,al);T(s,x,y,c,z,al)};
G.hot=[];const HOT=(x,y,w,h,fn,o={})=>G.hot.push({x,y,w,h,fn,sx:o.sx??x+w/2,sy:o.sy??y+h+4,anim:o.anim,dur:o.dur});
const BUB=(x,y,id,col='#2a1a10')=>{R(x,y,24,22,col);R(x+1,y+1,22,20,'#fffaf0');R(x+10,y+22,4,3,col);R(x+11,y+22,2,2,'#fffaf0');IM(id,x+3,y+2,18)};
// 10 cột x 6 hàng = 60 ô, đẩy sang phải để chừa đất trống cho nhà bếp bên trái
G.plotPos=i=>({x:155+(i%10)*28,y:18+Math.floor(i/10)*26});
G.zones={};
const vig=document.createElement('canvas');vig.width=W;vig.height=H;
(()=>{const v=vig.getContext('2d'),g=v.createRadialGradient(W/2,H/2,H*.42,W/2,H/2,W*.62);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,8,25,.4)');v.fillStyle=g;v.fillRect(0,0,W,H)})();
const cloud=t=>{for(let i=0;i<3;i++){const x=((t/90+i*170)%(W+140))-90,y=30+i*60;cx.fillStyle='rgba(15,40,25,.09)';cx.fillRect(x+8,y,60,22);cx.fillRect(x,y+6,76,12);cx.fillRect(x+20,y-5,32,32)}};
const flies=t=>{for(let i=0;i<3;i++){const x=W/2+Math.sin(t/1300+i*2.1)*150,y=70+Math.cos(t/900+i)*44+i*12,w=Math.abs(Math.sin(t/55+i))*3+1,c=['#f1a0b0','#f2d04a','#8fc8e0'][i];R(x-w,y,w,2,c);R(x+1,y,w,2,c);R(x,y,1,3,'#2a1a10')}};
G.draw=t=>{G.hot=[];G.updateCam();const zn=G.ui.zone,z=G.zones[zn],cam=G.cam;
 if(!z){cx.fillStyle="#1a3020";cx.fillRect(0,0,W,H);TS("Zone lỗi: "+zn,W/2,H/2,"#f2d04a",12);return}
 cx.save();cx.translate(-cam.x|0,-cam.y|0);
 const ww=G.CFG.world[zn]||{w:W,h:H};
 if(z.bg)cx.drawImage(z.bg,0,0);
 z.draw(t);G.fxDraw(t);
 cx.restore();
 if(zn==='farm'||zn==='market'||zn==='hub'||zn==='pets')cloud(t);
 if(zn==='farm')flies(t);
 const f=G.S.clock/120;if(f>.7){cx.fillStyle='rgba(25,30,90,'+((f-.7)/.3*.35).toFixed(2)+')';cx.fillRect(0,0,W,H)}
 cx.drawImage(vig,0,0)};

// NHÂN VẬT: chạm đâu đi đó, hoạt ảnh làm việc (cuốc đất, cho ăn, khuấy nồi, bưng món), hạt bụi, chữ bay
G.P={x:192,y:170,tx:192,ty:170,dir:'d',st:'idle',wt:0,wd:.7,wa:'dig',task:null,lt:0};
G.fx=[];G.fl=[];G.mk=null;
const BND={farm:[10,20,500,280],market:[8,20,410,220],kitchen:[10,20,390,210],shop:[10,20,390,210],hub:[12,24,620,340],pets:[10,20,390,210]};
const START={farm:[200,200],market:[200,160],kitchen:[200,180],shop:[200,160],hub:[300,190],pets:[200,160]};
G.P.enter=z=>{const s=START[z]||[W/2,H/2];Object.assign(G.P,{x:s[0],y:s[1],tx:s[0],ty:s[1],st:'idle',task:null,dir:'d'});G.updateCam()};
// Đi bộ tới POI rồi chuyển khu (không tele ngay)
// ===== DI CHUYỂN & POI =====
// Đổi map (tele vào điểm START của zone)
G.goZone=zone=>{
  if(!G.zones[zone]){G.msg&&G.msg('Chưa có khu: '+zone);return}
  G.ui.zone=zone;
  G.P.enter(zone);
  if(G.refreshUI)G.refreshUI();
};
// Đi bộ tới (sx,sy) rồi đổi map
G.travelTo=(zone,sx,sy)=>G.P.go(sx,sy,()=>G.goZone(zone));
// Cổng pixel: bấm → đi tới cửa → vào zone. Không còn biển chữ.
function roof(x,y,w,c){R(x,y,w,4,c);R(x+2,y-3,w-4,3,c);R(x+5,y-5,w-10,2,'#f2d9a0')}
const poiSign=(x,y,w,t)=>{blk(cx,x-w/2,y,w,13,'#5a3a20');rr(cx,x-w/2+2,y+2,w-4,9,'#8b5a2b');TS(t,x,y+10,'#ffe7a8',8)};
function poiShop(x,y,lb){const b=cx,L=x-40;
  blk(b,L+4,y-34,72,34,'#e8c888');for(let i=0;i<8;i++)rr(b,L+9+i*8,y-30,1,28,'#d0a868');
  blk(b,L-2,y-47,84,14,'#c0402a');blk(b,L+6,y-57,68,12,'#d8553a');blk(b,L+16,y-63,48,8,'#e86848');
  for(let i=0;i<20;i++)rr(b,L+1+i*4,y-45,1,10,'#8a2d1c');
  blk(b,L+10,y-22,13,12,'#9bd0e8');blk(b,L+57,y-22,13,12,'#9bd0e8');
  blk(b,L+28,y-22,24,22,'#3a2412');rr(b,L+30,y-20,20,18,'#d8402e');rr(b,L+39,y-20,2,18,'#a8301e');
  A.lantern(b,L+1,y-33,'#d8402e');A.lantern(b,L+71,y-33,'#f2a82a');
  poiSign(x,y-37,62,lb);A.pot(b,L-10,y-16,'#3b8a8a');A.bush(b,L+82,y-14,'#5fb04a')}
function poiMarket(x,y,lb){const b=cx,L=x-46;
  blk(b,L+4,y-40,84,40,'#f6ecd2');blk(b,L,y-40,6,40,'#8b5a2b');blk(b,L+86,y-40,6,40,'#8b5a2b');
  for(let i=0;i<11;i++)blk(b,L-2+i*8,y-56,9,16,i%2?'#fffaf0':'#d8402e');
  for(let i=0;i<11;i++)orb(b,L+3+i*8,y-41,4,i%2?'#fffaf0':'#d8402e');
  poiSign(x,y-36,70,lb);blk(b,L+4,y-9,84,9,'#a8733a');
  A.crate(b,L+8,y-22,16,13);A.basket(b,L+30,y-23,'#e8483a');A.basket(b,L+52,y-23,'#f2d04a');A.sack(b,L+72,y-27);
  A.lantern(b,L-6,y-34,'#f2a82a');A.lantern(b,L+90,y-34,'#5fb04a')}
function poiFarm(x,y,lb){const b=cx,L=x-38;
  orb(b,L-6,y-8,8,'#e8c050');orb(b,L+84,y-9,9,'#e0b848');
  blk(b,L+4,y-30,70,30,'#c49a60');for(let i=0;i<9;i++)rr(b,L+8+i*7,y-27,1,26,'#a8783c');
  blk(b,L-2,y-44,82,16,'#d8b050');blk(b,L+8,y-54,62,12,'#e0c060');blk(b,L+20,y-61,38,8,'#ecd078');
  for(let i=0;i<20;i++)rr(b,L+1+i*4,y-42,1,12,'#a87838');
  blk(b,L+31,y-20,16,20,'#6b4423');rr(b,L+43,y-10,2,2,'#f2d04a');
  blk(b,L+8,y-22,12,10,'#9bd0e8');blk(b,L+58,y-22,12,10,'#9bd0e8');
  poiSign(x,y-36,56,lb);A.crate(b,L-4,y-12,14,12);A.bush(b,L+62,y-14)}
function poiPets(x,y,lb){const b=cx,L=x-40;
  blk(b,L+2,y-36,76,36,'#a8573a');for(let i=0;i<9;i++)rr(b,L+6+i*8,y-33,1,32,'#8a4228');
  blk(b,L-4,y-48,88,14,'#d8553a');blk(b,L+8,y-58,64,12,'#e86848');for(let i=0;i<22;i++)rr(b,L-2+i*4,y-46,1,10,'#a8402a');
  blk(b,L+28,y-26,24,26,'#3a2412');rr(b,L+39,y-24,2,24,'#6b4423');
  orb(b,x-6,y-13,5,'#fffaf0');rr(b,x-8,y-20,3,2,'#d8402e');rr(b,x-2,y-12,3,2,'#e8863a');
  blk(b,L+62,y-14,16,14,'#e8c050');poiSign(x,y-37,64,lb);A.flower(b,L-2,y-8,'#f6b0c0');A.flower(b,L+84,y-8,'#f2d04a')}
function poiGate(x,y,lb){const b=cx;
  blk(b,x-26,y-36,8,36,'#a8a8a0');blk(b,x+18,y-36,8,36,'#a8a8a0');
  blk(b,x-30,y-44,60,9,'#c0402a');blk(b,x-22,y-50,44,7,'#d8553a');
  poiSign(x,y-30,40,lb);A.flower(b,x-34,y-6,'#f6b0c0');A.bush(b,x+28,y-12)}
G.drawPOI=(x,y,label,zone,sx,sy)=>{
  const k={farm:[poiFarm,76,62],market:[poiMarket,92,58],shop:[poiShop,84,64],pets:[poiPets,90,60]}[zone]||[poiGate,60,50];
  k[0](x,y,label);HOT(x-k[1]/2,y-k[2],k[1],k[2],()=>G.goZone(zone),{sx:sx??x,sy:sy??y+10})};
// Cửa gỗ trong nhà (bếp / quán) — không dùng cổng ngoài trời
G.drawDoor=(x,y,zone,sx,sy)=>{
  R(x-14,y-36,28,36,'#2a1a10');
  R(x-12,y-34,24,32,'#8b5a2b');
  R(x-10,y-30,9,24,'#a07040');R(x+1,y-30,9,24,'#c4a06a');
  R(x-2,y-18,3,3,'#f2d04a');
  R(x-16,y-38,32,4,'#5a3a20');
  HOT(x-16,y-40,32,42,()=>G.goZone(zone),{sx:sx??x,sy:sy??y+4});
};

G.P.go=(x,y,done)=>{
  const b=BND[G.ui.zone]||[10,20,W-10,H-10],p=G.P;
  p.tx=Math.max(b[0],Math.min(b[2],x));
  p.ty=Math.max(b[1],Math.min(b[3],y));
  p.task=done||null;
  p.st='walk';
};
G.updateCam=()=>{
  const ww=G.CFG.world[G.ui.zone]||{w:W,h:H},p=G.P;
  G.cam.x=Math.max(0,Math.min(Math.max(0,ww.w-W),p.x-W/2));
  G.cam.y=Math.max(0,Math.min(Math.max(0,ww.h-H),p.y-H/2));
};
// Hotspot: đi tới → nếu có anim thì làm việc rồi fn, không thì gọi fn (đổi map)
G.P.act=h=>{
  G.P.go(h.sx,h.sy,()=>{
    if(h.anim) G.P.work(h.anim,h.dur||.5,h.fn);
    else if(h.fn) h.fn();
  });
};
G.P.work=(a,d,fn)=>Object.assign(G.P,{st:'work',wa:a||'dig',wt:0,wd:d||.7,wfn:fn,ws:G.S.money,fxd:0});
G.spark=(x,y,c,n=6,g=120)=>{for(let i=0;i<n;i++)G.fx.push({x,y,vx:(Math.random()-.5)*50,vy:-20-Math.random()*40,l:.6+Math.random()*.4,c,s:2,g})};
G.float=(s,x,y,c)=>G.fl.push({s,x,y,c,l:1.2});
G.fxTap=(x,y)=>G.mk={x,y,t:0};
function chr(x,y,dir,st,wa,k,t){
 // TAP anim: sheet 64×64 = 4 cột (frame) × 4 hàng (hướng)
 // Hàng 0=xuống, 1=trái, 2=phải, 3=lên
 const walking=st==='walk';
 const frame=walking?((t/110|0)%4):((t/400|0)%2); // idle cũng nhịp nhẹ 2 frame
 const dirRow={d:0,l:1,r:2,u:3}[dir]??0;
 const img=G.loadImg(walking?G.ASSETS.char1_walk:G.ASSETS.char1_idle);
 // Bóng
 R(x-7,y+1,14,3,'#0005');R(x-5,y+2,10,2,'#0003');
 if(img&&img.complete&&img.naturalWidth>0){
  const sx=frame*16, sy=dirRow*16;
  cx.imageSmoothingEnabled=false;
  // Scale ×2, chân sát mặt đất (y)
  cx.drawImage(img,sx,sy,16,16,Math.round(x-16),Math.round(y-30),32,32);
 }else{
  R(x-6,y-28,12,12,'#f5c9a0');R(x-5,y-14,10,10,'#2a3a6e');R(x-4,y-4,3,5,'#1e2a4a');R(x+1,y-4,3,5,'#1e2a4a');
 }
 // Đồ đang cầm trên tay (Stardew-style)
 if(G.ui.held&&st!=='work'){
  const ox=dir==='l'?-14:dir==='r'?10:2, oy=dir==='u'?-18:-10;
  IM(G.ui.held,x+ox,y+oy-8,14);
 }
 // Dụng cụ khi làm việc
 if(st==='work'){
  const hx=x+12,hy=y-14;
  if(wa==='dig'){
    const an=-1.2+Math.sin(k*Math.PI)*2.5;
    for(let i=0;i<11;i++)R(hx+Math.cos(an)*i,hy+Math.sin(an)*i,2,2,'#8b5a2b');
    const ex=hx+Math.cos(an)*11,ey=hy+Math.sin(an)*11;R(ex-2,ey,5,3,'#9a9aa4');
    if(k>.45&&!G.P.fxd){G.P.fxd=1;G.spark(x+8,y,'#6b4423',6,140)}
  }else if(wa==='feed'){R(hx,hy,6,5,'#8b5a2b');R(hx,hy,6,2,'#c08a4c')}
  else if(wa==='stir'){R(hx,hy-6,2,8,'#8b5a2b');R(hx-1,hy-8,5,3,'#c08a4c')}
  else if(wa==='serve'){R(x-8,y-22,16,2,'#8b5a2b');R(x-3,y-26,7,4,'#fffaf0')}
 }
}
G.P.draw=t=>{const p=G.P,dt=Math.min((t-(p.lt||t))/1000,.1);p.lt=t;
 if(p.st==='walk'){const dx=p.tx-p.x,dy=p.ty-p.y,d=Math.hypot(dx,dy),s=95*dt;
  if(d<=s){p.x=p.tx;p.y=p.ty;p.st='idle';const f=p.task;p.task=null;f&&f()}
  else{p.x+=dx/d*s;p.y+=dy/d*s;p.dir=Math.abs(dx)>Math.abs(dy)*1.3?(dx<0?'l':'r'):(dy<0?'u':'d')}}
 else if(p.st==='work'){p.wt+=dt;if(p.wt>=p.wd){p.st='idle';p.wfn&&p.wfn();const g=G.S.money-p.ws;if(g>0){G.float('+'+g,p.x,p.y-38,'#f2d04a');G.spark(p.x,p.y-20,'#f2d04a',10,100)}if(G.refreshUI)G.refreshUI()}}
 G.updateCam();
 chr(Math.round(p.x),Math.round(p.y),p.dir,p.st,p.wa,Math.min(1,p.wt/p.wd),t)};
G.fxDraw=t=>{const dt=Math.min((t-(G._ft||t))/1000,.1);G._ft=t;
 G.fx=G.fx.filter(f=>(f.l-=dt)>0);G.fx.forEach(f=>{f.x+=f.vx*dt;f.y+=f.vy*dt;f.vy+=f.g*dt;R(f.x,f.y,f.s,f.s,f.c)});
 G.fl=G.fl.filter(f=>(f.l-=dt)>0);G.fl.forEach(f=>{f.y-=18*dt;TS(f.s,f.x,f.y,f.c,10)});
 if(G.mk){G.mk.t+=dt;if(G.mk.t>.5)G.mk=null;else{const r=2+G.mk.t*18;for(let i=0;i<8;i++){const a=i*Math.PI/4;R(G.mk.x+Math.cos(a)*r,G.mk.y+Math.sin(a)*r*.6,2,2,'#fff')}}}};

// 4 KHU: Nông trại · Chợ · Bếp · Quán. Mỗi khu = {bg: nền vẽ 1 lần, draw: phần động + vùng chạm}
const rr=(b,x,y,w,h,c)=>{b.fillStyle=c;b.fillRect(x,y,w,h)};
const mkBg=(fn,ww=W,hh=H)=>{const c=document.createElement('canvas');c.width=ww;c.height=hh;fn(c.getContext('2d'));return c};
const grass=b=>{const g=['#7ec85e','#72bc52','#68b048','#7ac45a'],cw=b.canvas.width,ch=b.canvas.height;
 // Cỏ nền mềm (kiểu Tiny Farm)
 for(let y=0;y<ch;y+=3)for(let x=0;x<cw;x+=3)rr(b,x,y,3,3,g[hs(x,y)%4]);
 // Cỏ nhọn nhỏ
 for(let i=0;i<200;i++){const x=hs(i,1)%cw,y=hs(i,2)%ch;rr(b,x,y,1,2,'#4a9a3c');if(i%3===0)rr(b,x+1,y+1,1,2,'#5aab4c')}
 // Đốm trắng + hoa nhỏ rải (như ảnh reference)
 for(let i=0;i<80;i++){const x=hs(i,3)%cw,y=hs(i,4)%ch;rr(b,x,y,1,1,'#e8f5d0')}
 for(let i=0;i<35;i++){const x=hs(i,5)%cw,y=hs(i,6)%ch;rr(b,x,y,2,2,['#fff','#f2d04a','#f1a0b0','#c8e090'][i%4]);rr(b,x,y+2,1,1,'#4a9a3c')}};
const river=(b,y)=>{const cw=b.canvas.width,ch=b.canvas.height;rr(b,0,y,cw,ch-y,'#2a1a10');rr(b,0,y+2,cw,ch-y-2,'#3f8fc4');rr(b,0,y+2,cw,3,'#6cb6dd')};
const awn=(b,x,y,w,c1,c2)=>{for(let i=0;i*14<w;i++){const c=i%2?c2:c1;rr(b,x+i*14,y,14,14,c);rr(b,x+i*14+2,y+14,10,3,c)}rr(b,x,y-2,w,2,'#2a1a10')};
const planks=(b,x,y,w,h,c,l)=>{rr(b,x,y,w,h,'#2a1a10');rr(b,x+2,y+2,w-4,h-4,c);for(let i=x+8;i<x+w-2;i+=8)rr(b,i,y+2,1,h-4,l)};
const rip=(t,y,ww=W)=>{for(let i=0;i<14;i++)R((t/45+i*53)%ww,y+(i%3)*5,9,1,'#b4e1f4')};
function palm(x,y,t){
 for(let i=0;i<28;i++){const sx=Math.round(Math.sin(i/9)*4);R(x+sx-3,y-i,6,1,'#2a1a10');R(x+sx-2,y-i,4,1,i%4?'#b07a3a':'#8b5a2b');R(x+sx+1,y-i,1,1,'#6b4423')}
 const tx=x+Math.round(Math.sin(27/9)*4),ty=y-28,sw=Math.sin(t/900)*2;
 [185,210,240,300,330,355,270].forEach(d=>{const a=d*Math.PI/180;for(let s=0;s<18;s++){const px=tx+Math.cos(a)*s*1.2+sw*s*.06,py=ty+Math.sin(a)*s*.55+s*s*.05;R(px-1,py+2,4,1,'#2f6a2e');R(px,py,3,2,s%5<2?'#4a9a3c':'#7bc653')}});
 R(tx-3,ty+1,4,4,'#3a2412');R(tx-2,ty+2,2,2,'#8b5a2b');R(tx+1,ty+2,4,4,'#3a2412');R(tx+2,ty+3,2,2,'#8b5a2b')}
const Z=G.zones;
// ===== NÔNG TRẠI (rộng hơn, 60 ô nhỏ, camera follow) =====
