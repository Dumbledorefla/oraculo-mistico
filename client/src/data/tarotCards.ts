/**
 * Banco de dados das cartas de Tarot - Arcanos Maiores
 * Cada carta possui interpretações para diferentes contextos
 */

export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  number: string;
  image: string;
  keywords: string[];
  meaning: {
    general: string;
    love: string;
    work: string;
    advice: string;
  };
  reversed: {
    general: string;
    love: string;
    work: string;
  };
}

// URLs das cartas geradas
const CARD_IMAGES = {
  back: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-1_1770154022000_na1fn_dGFyb3QtY2FyZC1iYWNr.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTFfMTc3MDE1NDAyMjAwMF9uYTFmbl9kR0Z5YjNRdFkyRnlaQzFpWVdOci5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Dn3hOgm5UfW82D7vmhb8xc3OiElkABHYjUlu-1jSHVJxPvcGBDz50Ebq-0eGMQ-6xbgHUHnz4JCUx4ntbpgUZN0Fvzsez9imcD44b5q25qsPHQOxJxjqoJeUiCHAd6FWqjXkU6lVEzQk4jkzaU6HHEYzGGFigAOb32YuxdbV9UDUNyDiSxnUdM~i6RrkH~WISwJypBSU3~-lrH33GGWWLvPoeL0m7sr-ObfhoNbehpnhcMcg2yag6UT17bSxOXhJw~f5u9kVU~~itf0jExIctf~X-s-5JGglRG0WXlCXYXLx5wwEM3us1WrLAOW6tmAkFtioehgSrHyifz7wbu3Dcw__",
  fool: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-2_1770154022000_na1fn_dGFyb3QtZm9vbA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTJfMTc3MDE1NDAyMjAwMF9uYTFmbl9kR0Z5YjNRdFptOXZiQS5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=uR3OyZdwml4r9eK9z86AufaxXJCyUXogzrNTmcJ1YfCt5demZ47l-SuA1QXX7HKIa4sGgFxCEivdsphE1L1w7zDOIJSRLkUi4-C7FUTZUV6VCoY-5H0QDLca~KHKzXKgrpVeW4ElhHgnia6KDFqFH0qLyxFqndWet0o4HGUP6mTse8QQSkXwlJ05MAj60K5QVi2PtWV0Tqu~MunVSwmD3hQ0pX1ofKwFBgyuq6BKLUjv8J8JmSe0hgCrk7KYAEHM90v0cMBWS9PFEoOeoQ2Z39farcA1rR8Vf9jmhKgAjWrU7WWhCJS5fmjnXvYWg4ivggdwy-psyjMRNqXtuSnOig__",
  magician: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-3_1770154031000_na1fn_dGFyb3QtbWFnaWNpYW4.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTNfMTc3MDE1NDAzMTAwMF9uYTFmbl9kR0Z5YjNRdGJXRm5hV05wWVc0LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RK82w2GRrPJtfkNX37Dq~8wRiFNtU01YuyGwTDrMZoab1rt4tXMtYnq9cWdwWH2Seh9oWo~TEtgk89EBHXdEIhxM3kNSbonc1gq2khcgtB91oUYMpYaM3Cn623mIO8-um1o8-Hp3d3tp3Pg~6EaSpKXq35MzZXOVcPAFHZmJqCws9g6r7lAtGQMk9227Gair98USwazHx5fE~NhM3AJ-MjAAaHvH-~UWVAdNnEe2v7ZRiSHos6fmUn1v9nQuv6UXyGgjLqq2wevfpg~i5KNSc5kAzrhaTJWJxScl1BsjEbamICO7QgsXafvXkDpxOaBCYmF6DismxfcBvRWN78LgZQ__",
  highPriestess: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-4_1770154019000_na1fn_dGFyb3QtaGlnaC1wcmllc3Rlc3M.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTRfMTc3MDE1NDAxOTAwMF9uYTFmbl9kR0Z5YjNRdGFHbG5hQzF3Y21sbGMzUmxjM00ucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=p49kxyqVyrJNO87lDqV03Cx466gL8g0IZIed5kYKTNcN-YgypXuqFGHM7mzhL9dDkNdfu-JwDiHZB1l24VRhp~juy13wmv2AKj3zSX2cC48Dus~RTve91piiYPClToLiljzPW0yXA6aus2rg-7ZQV~EdFr6~eSFXkWdQKQ2IYlbXSj1BMcVOwW~NFD9KkaPWpNCSw-51x2l0D6fZrel18idzhmC4OFCJ1S04RpNSBDJejcNnM9~a0Fl1SabOxtUvaRGBgJ0Q9m21GA1XXMEAjwewk6KTD~fZe5GCTlQuE03xHlMR~yzSdamrSRSDU-xiEFJdciNRseYX3BApklgRGw__",
  empress: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/8TJiklQQmS7ECdTkkz8oGW-img-5_1770154024000_na1fn_dGFyb3QtZW1wcmVzcw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94LzhUSmlrbFFRbVM3RUNkVGtrejhvR1ctaW1nLTVfMTc3MDE1NDAyNDAwMF9uYTFmbl9kR0Z5YjNRdFpXMXdjbVZ6Y3cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=cW5ajdXJV1qY5QpsDqQIEkSx~Q4TrWpC6tvqRUzPrvdUKo6VB--aROESdteEazL-suZ~tMvzCdsfZychZ6cSUMJnY0pRsylIKsWcrkFL~RTGgWOrHWxbyAwQ0cBhUPyRiu4lwb7gQfROG2wGQqaJVnwVkRjgwVTTABBNLX97uW2JcZVe1bB20ljkDl8yeZ-5wFOvqQx20vQpP3UwVcSLPa4D7ysj1kbv2T5BpvUMvF15ZGEq4DxtGfib7P2srn8LHONWKSqTUxnwses-USme-tPeCxHKV5Kfr~0kD6rM3Iu~7Y1rrQaX1QqZ09~J-0x7x0uts6N5d~jCMNYDcqJnug__",
  emperor: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/isNB5OVvdM8vh3fizc3lgB-img-1_1770154080000_na1fn_dGFyb3QtZW1wZXJvcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L2lzTkI1T1Z2ZE04dmgzZml6YzNsZ0ItaW1nLTFfMTc3MDE1NDA4MDAwMF9uYTFmbl9kR0Z5YjNRdFpXMXdaWEp2Y2cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ldtniLVXff9PBXC1JXU4UpEL04ZQ52yp2BGRTwj7nwdTTClbYP30sE642IoYKsF2mvbpInSmHFPuu2A0gdedn4Ar32wR~TcaKngWJHv~mECtxzLFSSaO8vvY2HvyNrhc1DETKe~x21uXYo9~FoR4MtxthzIrkoZSMwgegg~-iCU60tRfhfhVE9hSssuwcvtznqOEmvH~2b4YN0OhdA33~a1cnwG~Rs93h9teVxX3Y0wXU88spLe-rTsUICp5RZHfojKYaN2SzKbXLkO3WoRuZtcM-kGVf54Tu2-uHe6f7-NRH6OG5fKw~bEw5bQZ8EpICZAPGlRkZxfcSlR7~t1EeQ__",
  lovers: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/isNB5OVvdM8vh3fizc3lgB-img-2_1770154089000_na1fn_dGFyb3QtbG92ZXJz.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L2lzTkI1T1Z2ZE04dmgzZml6YzNsZ0ItaW1nLTJfMTc3MDE1NDA4OTAwMF9uYTFmbl9kR0Z5YjNRdGJHOTJaWEp6LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=v57VcmmAuiDafJyB-BNw5khaTLg0XtkcU4EGpP1RS05GEffHMXZRFn-uD5u05rEHepbyUKxYlUSDnYou6~5HPBHh-EMG1w0FHtU9R-yb-Yxr2itCmypmYViC32kB6nTUxF8en4iBCcw4Y7N-3RRHCHbtNoCa-NcGC8dizcrqnvqBN3GLZWDyXo0RG6a8nPtewiEHCqMLGrhnL~h4czmungiipudSsNYT3PTwEI6ztPz6wPVAC0j1dT25E3Qg9EJid0j2-ADttxcAS4ZK1GwiorLmRYOqEIpAQsu1kMIV-nsnMeRgApR7G0ieYadaV65ZJ9NVl~YF7z69BbtxjP~0Hw__",
  wheel: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/isNB5OVvdM8vh3fizc3lgB-img-3_1770154086000_na1fn_dGFyb3Qtd2hlZWw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L2lzTkI1T1Z2ZE04dmgzZml6YzNsZ0ItaW1nLTNfMTc3MDE1NDA4NjAwMF9uYTFmbl9kR0Z5YjNRdGQyaGxaV3cucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=n3SMslZnhxTFAbw8IKz3UoMRWbiO1aEbcwJo8pvt4gf~Il3f-SYKjv9P03cwTSvtfRT6Vjg6TwfziZvFa0jNjJxv1md96TmS4vfVS4UMH44kn49to7dByRDut4Wl~q3yDQu-MyOjSpzpvi8K4wEKK-S0undr2OEBz-23F1GizQUit4ddUjDVOYsb3xYonzjN9odFBReKctxUhYAPx2TpK7GfQo~HRsqg8AOMRhh1qdKWk5Rx58~6bYusdpMwxDp2o1wAocoMA3RVbETuj9uVmujMVtZu3IGW5h1Bu74ACMkNC9q8sbX1AIrk5h7mlR~MOjbRKPcPwRPsD7bHmbofCQ__",
  star: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/isNB5OVvdM8vh3fizc3lgB-img-4_1770154086000_na1fn_dGFyb3Qtc3Rhcg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L2lzTkI1T1Z2ZE04dmgzZml6YzNsZ0ItaW1nLTRfMTc3MDE1NDA4NjAwMF9uYTFmbl9kR0Z5YjNRdGMzUmhjZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=CRklJIw9SFeP9nvzIb6NKcImC5g0Odk6PIZ2mOHanZH~M5rurbFf~lkhBUbC8ciVMK6QwIDAzQQYy-khZl1CbE-VCD5HGnvpcn-TB4v38qec84HVGiXcvZKsevdJp9fmutWLitusSonjCVpyMVOWS7eSoVhOx-ji26pf1RfEYn9xPkgVYzPE-YB7dpPpcpsI9k2afNIxmYEYPFIjOHCOcblVRemH1B4l4cDMbOeGvVMaZYt72y1wVHn-c2aiw-Tj8M0BzUlt0gqf9Mh6K1MII8~rt2yIYQzvnhqu546voDpZyHFKxW3VWZXnfcsKB8leRD8bzxUTuOYTz4oBdbbe5A__",
  moon: "https://private-us-east-1.manuscdn.com/sessionFile/Vf2iwFJXfxabWANoxH8Y4R/sandbox/isNB5OVvdM8vh3fizc3lgB-img-5_1770154087000_na1fn_dGFyb3QtbW9vbg.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvVmYyaXdGSlhmeGFiV0FOb3hIOFk0Ui9zYW5kYm94L2lzTkI1T1Z2ZE04dmgzZml6YzNsZ0ItaW1nLTVfMTc3MDE1NDA4NzAwMF9uYTFmbl9kR0Z5YjNRdGJXOXZiZy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=XVCuryh0UtuFBhsQAUpPwBg09mfH1P4zfxhSa9z33nx5WFX1l9dG-VvnYdn-gi43viBxfJcFljCQN8r2seTnuQF8-~PXhF3j7NTC55Py~YrYz2jQqAJIT4SrzlwwSfGrZ-C5vyNtvZmbUreGcnxrBnvfIZnTZKl1EuvyLpIdjZUE-VcQSG8LQbTbhTDyuk2GgOKnRJPKfrzLrtXvJoD03566FmMZj1GT~YpKLz-xddWcX08~WL8NgCDm3-TpD7fOdk8g9kX1A38rUu7od9sPGHgzs3mUZF9Y1bp1onum82WZLoRqMDNG1iWulYwE3tgVg~w~NHamTeikV7V4Ak4UlA__",
};

export const CARD_BACK_IMAGE = CARD_IMAGES.back;

export const tarotCards: TarotCard[] = [
  {
    id: 0,
    name: "O Louco",
    nameEn: "The Fool",
    number: "0",
    image: CARD_IMAGES.fool,
    keywords: ["Novos começos", "Inocência", "Aventura", "Espontaneidade"],
    meaning: {
      general: "O Louco representa novos começos, aventura e a coragem de dar o primeiro passo em direção ao desconhecido. É o momento de confiar na vida e seguir seu coração, mesmo sem saber exatamente onde o caminho vai levar. Esta carta traz a energia da inocência e da fé no universo.",
      love: "No amor, O Louco indica um momento de abertura para novas experiências românticas. Pode significar o início de um relacionamento inesperado ou a renovação de uma relação existente. É hora de se permitir amar sem medo.",
      work: "Na carreira, esta carta sugere que é hora de arriscar, seja começando um novo projeto, mudando de emprego ou seguindo uma paixão. Confie em suas habilidades e dê o salto.",
      advice: "Permita-se ser espontâneo e confie no processo da vida. Nem tudo precisa ser planejado - às vezes, a magia acontece quando nos abrimos para o inesperado."
    },
    reversed: {
      general: "Imprudência, decisões precipitadas e falta de planejamento. Cuidado com riscos desnecessários.",
      love: "Medo de compromisso ou comportamento irresponsável em relacionamentos.",
      work: "Decisões profissionais mal pensadas ou falta de foco nos objetivos."
    }
  },
  {
    id: 1,
    name: "O Mago",
    nameEn: "The Magician",
    number: "I",
    image: CARD_IMAGES.magician,
    keywords: ["Manifestação", "Poder pessoal", "Habilidade", "Concentração"],
    meaning: {
      general: "O Mago simboliza o poder de manifestar seus desejos através da vontade, foco e ação. Você tem todas as ferramentas necessárias para alcançar seus objetivos - agora é hora de usá-las. Esta carta representa domínio sobre os elementos e a capacidade de transformar ideias em realidade.",
      love: "No amor, O Mago indica que você tem o poder de criar o relacionamento que deseja. Use sua comunicação e charme para atrair ou fortalecer conexões. É um momento favorável para declarações e iniciativas românticas.",
      work: "Profissionalmente, esta carta é extremamente positiva. Você está em um momento de grande potencial criativo e capacidade de realização. Projetos iniciados agora têm grandes chances de sucesso.",
      advice: "Concentre sua energia e intenção naquilo que deseja manifestar. Você é mais poderoso do que imagina - use esse poder com sabedoria e responsabilidade."
    },
    reversed: {
      general: "Manipulação, uso inadequado de talentos ou falta de direção. Potencial desperdiçado.",
      love: "Jogos de sedução ou falta de sinceridade nas relações.",
      work: "Talentos não aproveitados ou dificuldade em concretizar projetos."
    }
  },
  {
    id: 2,
    name: "A Sacerdotisa",
    nameEn: "The High Priestess",
    number: "II",
    image: CARD_IMAGES.highPriestess,
    keywords: ["Intuição", "Mistério", "Sabedoria interior", "Subconsciente"],
    meaning: {
      general: "A Sacerdotisa representa a sabedoria interior, a intuição e os mistérios do subconsciente. É hora de olhar para dentro, confiar em seus instintos e prestar atenção aos sonhos e sinais sutis. Nem tudo precisa ser revelado agora - alguns segredos têm seu tempo.",
      love: "No amor, esta carta sugere que você precisa confiar mais em sua intuição sobre relacionamentos. Pode haver algo não dito ou oculto que precisa vir à tona. Paciência e observação são fundamentais.",
      work: "Na carreira, A Sacerdotisa indica que nem todas as informações estão disponíveis. Aguarde antes de tomar decisões importantes e confie em seus instintos sobre pessoas e situações.",
      advice: "Cultive o silêncio interior e ouça sua voz interna. A resposta que você busca já está dentro de você - basta criar espaço para ouvi-la."
    },
    reversed: {
      general: "Segredos revelados, ignorar a intuição ou superficialidade.",
      love: "Desconfiança excessiva ou dificuldade em se conectar emocionalmente.",
      work: "Informações ocultas que podem prejudicar ou falta de clareza."
    }
  },
  {
    id: 3,
    name: "A Imperatriz",
    nameEn: "The Empress",
    number: "III",
    image: CARD_IMAGES.empress,
    keywords: ["Abundância", "Fertilidade", "Natureza", "Criatividade"],
    meaning: {
      general: "A Imperatriz é a carta da abundância, fertilidade e criação. Representa a energia feminina em sua forma mais nutritiva e criativa. É um momento de crescimento, prosperidade e conexão com a natureza e os ciclos da vida.",
      love: "No amor, A Imperatriz traz energia de romance, sensualidade e nutrição emocional. Pode indicar gravidez, casamento ou simplesmente um período de grande harmonia e prazer nos relacionamentos.",
      work: "Profissionalmente, esta carta indica um período fértil para projetos criativos. Negócios relacionados a beleza, arte, natureza ou cuidado tendem a prosperar.",
      advice: "Conecte-se com sua criatividade e permita-se desfrutar dos prazeres da vida. Cuide de si mesmo e dos outros com amor e generosidade."
    },
    reversed: {
      general: "Bloqueio criativo, dependência ou negligência com o autocuidado.",
      love: "Problemas de fertilidade, ciúmes ou sufocamento no relacionamento.",
      work: "Projetos estagnados ou falta de inspiração criativa."
    }
  },
  {
    id: 4,
    name: "O Imperador",
    nameEn: "The Emperor",
    number: "IV",
    image: CARD_IMAGES.emperor,
    keywords: ["Autoridade", "Estrutura", "Controle", "Liderança"],
    meaning: {
      general: "O Imperador representa autoridade, estrutura e o poder de criar ordem a partir do caos. É a energia masculina em sua forma mais protetora e organizadora. Esta carta fala sobre assumir responsabilidades e liderar com sabedoria.",
      love: "No amor, O Imperador pode indicar um parceiro protetor e estável, ou a necessidade de estabelecer limites saudáveis. Relacionamentos precisam de estrutura tanto quanto de paixão.",
      work: "Na carreira, esta carta é muito favorável para posições de liderança, negócios próprios ou qualquer situação que exija organização e autoridade. É hora de assumir o controle.",
      advice: "Estabeleça estruturas sólidas em sua vida e assuma a responsabilidade por suas escolhas. Lidere pelo exemplo e proteja aqueles que dependem de você."
    },
    reversed: {
      general: "Autoritarismo, rigidez excessiva ou abuso de poder.",
      love: "Controle excessivo ou falta de expressão emocional no relacionamento.",
      work: "Conflitos com autoridades ou dificuldade em aceitar hierarquias."
    }
  },
  {
    id: 5,
    name: "Os Amantes",
    nameEn: "The Lovers",
    number: "VI",
    image: CARD_IMAGES.lovers,
    keywords: ["Amor", "União", "Escolhas", "Harmonia"],
    meaning: {
      general: "Os Amantes representam não apenas o amor romântico, mas também escolhas importantes e a união de opostos. Esta carta fala sobre alinhamento de valores, decisões do coração e a importância de seguir o que realmente importa para você.",
      love: "No amor, esta é uma das cartas mais positivas. Indica conexão profunda, atração mútua e relacionamentos abençoados. Se você está solteiro, um encontro significativo pode estar próximo.",
      work: "Profissionalmente, Os Amantes sugerem parcerias harmoniosas e decisões importantes sobre carreira. Escolha caminhos que estejam alinhados com seus valores mais profundos.",
      advice: "Siga seu coração nas decisões importantes. Quando valores e desejos estão alinhados, o caminho se torna claro e abençoado."
    },
    reversed: {
      general: "Desequilíbrio, escolhas difíceis ou conflito de valores.",
      love: "Desarmonia, tentação ou dificuldade em se comprometer.",
      work: "Parcerias problemáticas ou decisões profissionais conflitantes."
    }
  },
  {
    id: 6,
    name: "A Roda da Fortuna",
    nameEn: "Wheel of Fortune",
    number: "X",
    image: CARD_IMAGES.wheel,
    keywords: ["Destino", "Ciclos", "Mudança", "Sorte"],
    meaning: {
      general: "A Roda da Fortuna representa os ciclos da vida, o destino e as mudanças inevitáveis. O que sobe, desce; o que desce, sobe. Esta carta lembra que a vida está sempre em movimento e que devemos fluir com as mudanças.",
      love: "No amor, a Roda indica mudanças significativas - pode ser o início de um novo ciclo romântico ou uma transformação em um relacionamento existente. Esteja aberto às surpresas do destino.",
      work: "Na carreira, esta carta sugere que mudanças estão chegando. Pode ser uma promoção inesperada, uma nova oportunidade ou uma virada de sorte. Aproveite os ventos favoráveis.",
      advice: "Aceite que a mudança é a única constante. Quando a roda gira a seu favor, aproveite; quando gira contra, tenha paciência - ela girará novamente."
    },
    reversed: {
      general: "Resistência à mudança, má sorte temporária ou ciclos negativos.",
      love: "Estagnação no relacionamento ou repetição de padrões negativos.",
      work: "Reveses profissionais ou dificuldade em se adaptar a mudanças."
    }
  },
  {
    id: 7,
    name: "A Estrela",
    nameEn: "The Star",
    number: "XVII",
    image: CARD_IMAGES.star,
    keywords: ["Esperança", "Inspiração", "Renovação", "Serenidade"],
    meaning: {
      general: "A Estrela é uma das cartas mais positivas do Tarot. Representa esperança, inspiração, cura e renovação espiritual. Após tempos difíceis, esta carta anuncia um período de paz, clareza e conexão com o divino.",
      love: "No amor, A Estrela traz esperança e cura. Se você passou por desilusões, este é um momento de renovação. Novos amores podem surgir de forma inesperada e abençoada.",
      work: "Profissionalmente, esta carta indica inspiração, reconhecimento e realização de sonhos. Projetos criativos são especialmente favorecidos. Confie em sua visão.",
      advice: "Mantenha a fé e a esperança, mesmo nos momentos mais escuros. A luz sempre retorna, e seus sonhos são válidos e alcançáveis."
    },
    reversed: {
      general: "Desesperança, falta de fé ou desconexão espiritual.",
      love: "Desilusão amorosa ou dificuldade em acreditar no amor.",
      work: "Falta de inspiração ou medo de seguir seus sonhos."
    }
  },
  {
    id: 8,
    name: "A Lua",
    nameEn: "The Moon",
    number: "XVIII",
    image: CARD_IMAGES.moon,
    keywords: ["Intuição", "Ilusão", "Medo", "Subconsciente"],
    meaning: {
      general: "A Lua representa o mundo dos sonhos, da intuição e das ilusões. Esta carta convida você a explorar seu subconsciente, mas também alerta sobre enganos e medos infundados. Nem tudo é o que parece sob a luz da Lua.",
      love: "No amor, A Lua pode indicar confusão, segredos ou medos que precisam ser enfrentados. É importante ter clareza sobre seus sentimentos e não se deixar levar por ilusões românticas.",
      work: "Na carreira, esta carta sugere que pode haver informações ocultas ou mal-entendidos. Confie em sua intuição, mas verifique os fatos antes de tomar decisões importantes.",
      advice: "Explore seus medos e sonhos com coragem. A escuridão da noite revela verdades que a luz do dia esconde. Confie em sua intuição, mas mantenha os pés no chão."
    },
    reversed: {
      general: "Clareza após confusão, superação de medos ou revelação de verdades.",
      love: "Fim de ilusões românticas ou clareza sobre sentimentos.",
      work: "Revelação de informações ocultas ou fim de incertezas."
    }
  }
];

export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getCardById = (id: number): TarotCard | undefined => {
  return tarotCards.find(card => card.id === id);
};
