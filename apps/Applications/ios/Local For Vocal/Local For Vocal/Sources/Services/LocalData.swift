import Foundation

struct LocalData {
    static let womenLayoutJSON = """
        [
            {
                "id": "header",
                "type": "fashion_header",
                "dataSource": {
                    "type": "STATIC"
                },
                "props": {
                    "categories": [
                        "Western",
                        "Ethnic",
                        "Luxe",
                        "Accessories",
                        "Activewear"
                    ]
                },
                "children": []
            },
            {
                "id": "hero_banner",
                "type": "banner",
                "dataSource": {
                    "type": "STATIC"
                },
                "props": {
                    "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuCWMEyYMVfSHhKIiqrG0BFfBtpM5oT7f5aC2cDexPxWyXACit1PnvxAZ2fcsPSskV7AbHp9fsLP4q1egPLJoza9h2JffHBvA1kCrIpg5AXROITqONfuJP9KWgz-A0-GvxfzfiL4VfULVgxCMjFA5iV8z077i1rJpZoFTEM2qmrYR5qPn-u5FnkNNlzRluWk5LAK27lJWB8tg3GX6Uvs6QumeU6DCIj2h39cb6O-EqghnXJLcZkDzYrQY0rfeLkXgl9qALqss5UsQ5ZF",
                    "height": 460
                },
                "children": []
            },
            {
                "id": "sub_categories",
                "type": "grid",
                "dataSource": {
                    "type": "STATIC"
                },
                "props": {
                    "items": [
                        {
                            "id": "1",
                            "name": "Dresses",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCKKsWNx-7kEcxlgVUzEHgoG64-9MNTZOur82nZavgM1Nc3OUiCJt_TSr5KWBoCcEsro9fdwJnwsdEO3Hy4HHKLepOJa6Yx8jvyBiT4DFcPSzaOHlPAV_HCqtlXkPAnQJoeH4uWPwDuCRvBk-GYqD9VVKIcVENSaw1pRhdVotBKcoDtONvdI3PXV7xiO86Nwz49ElQANWJSxape8TmkjKNRfhik02sPkyCzpiRKvzQbtLvVrHqXqC9HZvYzLf-GVcT1K_aojKFhJVtH",
                            "title": "Dresses"
                        },
                        {
                            "id": "2",
                            "name": "Kurta Sets",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB2vP8Mlne2objfu4XQf4oG2pIGZAQ3aKJF0enwEImMW94bCDn8EroMO0FNG13ErudRoHkjE4PBkRkL5u4DEaRx80XIBX4Zh8p0PG0euUmJKPbnDhREZm5EqRy880CYjXnoTCwamG1aJdyyO5ZOlvN_EfYEKVHKbZcx9YYSrMJnpuUc0LZVW1GSRUPvBsl0cMZEn2WEgBCnR8itSxcDpzUSNKjXbRVRSO3cyax20KrWxVBXaYZQnHLGe41SHu6JExwIs4i3Z8Xhei9H",
                            "title": "Kurta Sets"
                        },
                        {
                            "id": "3",
                            "name": "Handbags",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB7mqZAiS9jux-sBIEfnk7pSk_rXG-EBSOUFXKXQ7e_Dw_gePUNyGRl8PYW1HsgLoH4lm4uAIF-mA7qk9KIv9ee6PPkfTbuYD772N6aTldY21CaXvMnvETKnXtgZxxsgjgHrDHvbL_RyJCC_34M20atBFqNcxwzmzr5apSnPpgYoLy0yInncaiE4mIV8S1YGQZhZ3BsVY3zmFi7cPssGU4nYaah0ZLkaNgEFObkgcebaGOiam-LsjSk8cikee_q_4Fi6E8R6KkijyrJ",
                            "title": "Handbags"
                        },
                        {
                            "id": "4",
                            "name": "Heels",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAmYp3FgtXkKe3Yh7yRpkofxE0QMT8aZtCgFyitT11pLpUvn63g4e92VO_eiKG7TWVt9UcYr1bi4HLHTIad5TmHXAd6rywXv2VUjwxyDml4azadN88c_n7VuXrlUPsHsm7kJITolfQlHhzJGChmVukxLgfOw5itQRrD21DqHrmVgvFEI9H8x9ZXCWOAkSv2niLpisDurJAK-Jl2Se-TKjCSurJPS8qqeUEB2mJVUS5poP_BEXxkP-jPMnUXDKtZoPJ9JgKePP2zCFBu",
                            "title": "Heels"
                        },
                        {
                            "id": "5",
                            "name": "Jewelry",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAJDx4heTiJSnD7HMsl6zZkrK--j9AGSMFZuHhq2IuQHoUcACznJ3McMjqqLrUXDqkPXbFrjCh1V9MRa3ifKzNbTMnJOyLZL3S6Lh17PW4iq1YCw4VfAKBxJ8Hv8Z6f_05rnPT1A8sIoLzVzS2HZbGXo9BS-PigMS_hmb-cq4I0aJFdsZBQxkOEiiLIDe9a4QGiA5zNyCvlgx5GujRCqk6kl56hdXUBHM4b1ZpRl_6_wP2IuoBugRRlGaySyaU0P4qOidij5rvJzJGj",
                            "title": "Jewelry"
                        },
                        {
                            "id": "6",
                            "name": "Watches",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBksqkdTz3XxSC1NoFe-paTB76fB8LEmR6p4xdXYovZLpgwqBpTPnboAW0q7v4jrZeCwAPoHMEG_HWmfL4GOlkYWuQHx2XACNvtBKyD7QlZLFiRjeU0HurcBn7E_dWsNoq6GfXxPRjsBRwx7qNG-kXrJS54O2eYCJ5eXiQqSH5gSt3D81WdM1OKbYprHurmWZYLmg5mfl_t7OnmOcpie9UCqOYwHV2QbKJwjxmOvGYhm_LxBiIDXH2647kDBBRWkEVmGkTqD48zeoCC",
                            "title": "Watches"
                        },
                        {
                            "id": "7",
                            "name": "Bottoms",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuCpaZxyGCBKY_K4CrA8x3zYu6_pvEW8UJYxyjynVCAzhR7F9peYP5PJu7cluCmKu7eN3e8RGHYacWU_WcwbxrRWq0A0HlvXyJVPiSkIC0MPWoVcsOz6dbF7tbKs-ySeC0CuXuOx0Niz2cqA3YIbUtMYK-rtwqymlxjhbLxDDYb6wIUQJMCtUAOE6GwJv9IKA22nl6YQI0G0KrVo5tjUsQy2oKGJj3RyEAt37j9AbBWM6UjAxvLzRR-R-RrGbBnAeULT5W6h7mJlS9ZA",
                            "title": "Bottoms"
                        },
                        {
                            "id": "8",
                            "name": "Sunglasses",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuA5ReQ8pxQcN6X2F1xii7GeNInLZXf4msMppSKROOgjlKTiKvcovbUXeW9_sCzjRc0e_ahM5oiaQTwhFfpp-8xLwIVJwIdMXiFZgxzS0Z7Ki3wUZ8zA8vzIvvTt2sw8tThQi0ozTmwmlc9L9iOJhEM5Bwb5AtL9JO8Cbmr2if-5j--F7hRVrPVXR1FbqodhEvof5GluP6DhT8y24nPVWwjgukAsaTJtR5Rc72ACq19ZCnPbzSDbHybRnvz_3YwulPZtzqkaCAjDC6aH",
                            "title": "Sunglasses"
                        }
                    ]
                },
                "children": []
            },
            {
                "id": "trending_section",
                "type": "fashion_trending",
                "dataSource": {
                    "type": "STATIC"
                },
                "props": {
                    "items": [
                        {
                            "id": "t1",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuD-Oo1nZKXGGqOkuRCXFOKA7srndEVXEaYUCnRtI3SZ1gLKoYKHx5D3YxQjbrwUFHl5PB9f23jQSPgUq8YdJkcnh6hC8xxsIxdHvUR4pBWgdvlCT-mw8hF2pkxW0TV7CbM6GsubCxkfvspWHNUu33gxDl7XYhThH-XeuQklG1z-hl0UoIJzTNN9f9pm-HTego4z62qvM9GfAOg2A1x1qqYcgRu25gOlpbNJmv-e-JxmP_UbVJkIGHV_TlR2zjJjdx6VxIO6O8k1YpJ3",
                            "title": "Satin Slip Dresses",
                            "badge": "New Season",
                            "actionUrl": "fashion/women/satin-slip-dresses"
                        },
                        {
                            "id": "t2",
                            "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuDEGb5afFGFiBY8qbiW_kHE_Bd7cmDatWW5OWiYdzTeM0EXefomGJmOstOrqRcsKzxhTE2ZCGzqfL5Bfb4xIojeqNpNMYezyy137pYCzXK1R6jSrAHpq9BrG72C4wdSXuJueoZr2yG64mS1DLKTb-rgvocJWD3F0B-0SWONSFkOTuZuunpiwCHz85Tnltv6vZUY8SdbM3Sfy1DI8WzU6VwcZqVMEoGW4Dhjqcdlmbqf2Br0MOmjLFyfDSdE1Bwudce3cbCa743xCKmw",
                            "title": "Embroidered Lehengas",
                            "badge": "Wedding Edit",
                            "actionUrl": "fashion/women/embroidered-lehengas"
                        }
                    ]
                },
                "children": []
            }
        ]
        """
}
