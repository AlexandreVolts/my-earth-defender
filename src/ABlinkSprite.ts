export abstract class ABlinkSprite {
  private static readonly BLINK_DURATION = 0.6;
  private static readonly BLINK_BLINK_RATE = 0.2;
  private hitMarker = 0;

  public blink() {
    this.hitMarker = ABlinkSprite.BLINK_DURATION;
  }
  public update(delta: number) {
    this.hitMarker -= this.hitMarker <= 0 ? 0 : delta;
  }
  public get isBlinking() {
    return (this.hitMarker % ABlinkSprite.BLINK_BLINK_RATE > ABlinkSprite.BLINK_BLINK_RATE * 0.5);
  }
}