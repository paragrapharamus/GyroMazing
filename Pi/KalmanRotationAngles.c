#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>
#include "libSensor.h"

#define GYRO_SCALE 131
#define DT 0.01

// Used by Kalman Filters
static float q_angle = 0.01;
static float q_gyro = 0.0003;
static float r_angle = 0.01;

static double kalman_filter_x(double acc_angle, double gyro_rate) {

  static double x_bias = 0;
  static double xp_00 = 0, xp_01 = 0, xp_10 = 0, xp_11 = 0;
  static double kf_angle_x;

  kf_angle_x += DT * (gyro_rate - x_bias);

  xp_00 += -DT * (xp_10 + xp_01) + q_angle * DT;
  xp_01 += -DT * xp_11;
  xp_10 += -DT * xp_11;
  xp_11 += +q_gyro * DT;

  double y = acc_angle - kf_angle_x;
  double s = xp_00 + r_angle;
  double k_0 = xp_00 / s;
  double k_1 = xp_10 / s;

  kf_angle_x += k_0 * y;
  x_bias += k_1 * y;
  xp_00 -= k_0 * xp_00;
  xp_01 -= k_0 * xp_01;
  xp_10 -= k_1 * xp_00;
  xp_11 -= k_1 * xp_01;

  return kf_angle_x;
}

static double kalman_filter_y(double acc_angle, double gyro_rate) {

  static double y_bias = 0;
  static double yp_00 = 0, yp_01 = 0, yp_10 = 0, yp_11 = 0;
  static double kf_angle_y;

  kf_angle_y += DT * (gyro_rate - y_bias);

  yp_00 += -DT * (yp_10 + yp_01) + q_angle * DT;
  yp_01 += -DT * yp_11;
  yp_10 += -DT * yp_11;
  yp_11 += +q_gyro * DT;

  double y = acc_angle - kf_angle_y;
  double s = yp_00 + r_angle;
  double k_0 = yp_00 / s;
  double k_1 = yp_10 / s;

  kf_angle_y += k_0 * y;
  y_bias += k_1 * y;
  yp_00 -= k_0 * yp_00;
  yp_01 -= k_0 * yp_01;
  yp_10 -= k_1 * yp_00;
  yp_11 -= k_1 * yp_01;

  return kf_angle_y;
}
int main() {
  putenv((char *) "WIRINGPI_GPIOMEM=1");
  wiringPiSetupGpio();
// Initialise sensor
  printf("Init gyro\n");
  init_gyro();

// Button
  const int but_pin = 5;
  pinMode(but_pin, INPUT);
  pullUpDnControl(but_pin, PUD_UP);

  while (true) {

    double base_gyro_x = 0, base_gyro_y = 0;
    bool stare = false;

    if (!digitalRead(but_pin)) {
      stare = true;
      int butt = digitalRead(but_pin);
      while (!butt)
        butt = digitalRead(but_pin);
    }

    if (stare) {
      printf("begin\n");

      const int pin = 4;

      // Warning LED
      digitalWrite(pin, HIGH);
      delay(500);
      digitalWrite(pin, LOW);

      // Initial values
      for (int i = 1; i <= 10; i++) {
        base_gyro_x += get_gyro_x();
        base_gyro_y += get_gyro_y();
        delay(100);
      }
      base_gyro_x /= 10;
      base_gyro_y /= 10;

      int first_millis = millis();
      int last_time = first_millis;

      while (true) {

        double angle_x = get_angle_x();
        double angle_y = get_angle_y();
        int current_time = millis() - first_millis;

        double time_step = (current_time - last_time) / 1000.0;

        double rx = kalman_filter_x(angle_x, time_step * ((get_gyro_x() - base_gyro_x) / GYRO_SCALE));
        double ry = kalman_filter_y(angle_y, time_step * ((get_gyro_y() - base_gyro_y) / GYRO_SCALE));
        printf(" rx: %2.5f ry: %2.5f\n", rx, ry);

        FILE *output_file = fopen("out_gyro.txt", "w");
        if(!output_file) {
          perror("Could not open the file.\n");
          continue;
        } else {
          fprintf(output_file, "%2.5f %2.5f", rx, ry);
          fflush(output_file);
          fclose(output_file);
        }
        last_time = current_time;
        if(!digitalRead(but_pin)) {
          stare = false;
          int butt = digitalRead(but_pin);
          while(!butt) {
            butt = digitalRead(but_pin);
          }
          sleep(1);
          break;
        }
      }
      return 0;
    }
  }
}

