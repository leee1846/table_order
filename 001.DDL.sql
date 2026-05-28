-- DROP SCHEMA nexa;

CREATE SCHEMA nexa;

SET search_path TO nexa, public;

-- DROP SEQUENCE nexa.ad_campaign_campaign_seq_seq;

CREATE SEQUENCE nexa.ad_campaign_campaign_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_campaign_content_content_seq_seq;

CREATE SEQUENCE nexa.ad_campaign_content_content_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_campaign_shop_campaign_shop_seq_seq;

CREATE SEQUENCE nexa.ad_campaign_shop_campaign_shop_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_campaign_shop_exclusion_exclusion_seq_seq;

CREATE SEQUENCE nexa.ad_campaign_shop_exclusion_exclusion_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_menu_group_ad_menu_group_seq_seq;

CREATE SEQUENCE nexa.ad_menu_group_ad_menu_group_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_menu_group_detail_ad_menu_group_detail_seq_seq;

CREATE SEQUENCE nexa.ad_menu_group_detail_ad_menu_group_detail_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.ad_menu_group_shop_sync_sync_seq_seq;

CREATE SEQUENCE nexa.ad_menu_group_shop_sync_sync_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.app_version_app_version_seq_seq;

CREATE SEQUENCE nexa.app_version_app_version_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.category_category_seq_seq;

CREATE SEQUENCE nexa.category_category_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.category_table_map_category_table_map_seq_seq;

CREATE SEQUENCE nexa.category_table_map_category_table_map_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.device_device_seq_seq;

CREATE SEQUENCE nexa.device_device_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.device_password_fail_log_device_password_fail_log_seq_seq;

CREATE SEQUENCE nexa.device_password_fail_log_device_password_fail_log_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.holiday_holiday_seq_seq;

CREATE SEQUENCE nexa.holiday_holiday_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.locale_shop_map_locale_shop_map_seq_seq;

CREATE SEQUENCE nexa.locale_shop_map_locale_shop_map_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.member_auth_auth_seq_seq;

CREATE SEQUENCE nexa.member_auth_auth_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.menu_image_image_seq_seq;

CREATE SEQUENCE nexa.menu_image_image_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.menu_image_sample_menu_image_sample_seq_seq;

CREATE SEQUENCE nexa.menu_image_sample_menu_image_sample_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.menu_menu_seq_seq;

CREATE SEQUENCE nexa.menu_menu_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.notice_notice_seq_seq;

CREATE SEQUENCE nexa.notice_notice_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.option_group_option_group_seq_seq;

CREATE SEQUENCE nexa.option_group_option_group_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.option_option_seq_seq;

CREATE SEQUENCE nexa.option_option_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.order_detail_menu_order_detail_menu_seq_seq;

CREATE SEQUENCE nexa.order_detail_menu_order_detail_menu_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.order_detail_option_order_detail_option_seq_seq;

CREATE SEQUENCE nexa.order_detail_option_order_detail_option_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.password_fail_log_seq_seq;

CREATE SEQUENCE nexa.password_fail_log_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.payment_payment_seq_seq;

CREATE SEQUENCE nexa.payment_payment_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.pos_mapping_data_mapping_data_seq_seq;

CREATE SEQUENCE nexa.pos_mapping_data_mapping_data_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.shop_group_map_shop_group_map_seq_seq;

CREATE SEQUENCE nexa.shop_group_map_shop_group_map_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.shop_group_shop_group_seq_seq;

CREATE SEQUENCE nexa.shop_group_shop_group_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.shop_page_detail_image_seq_seq;

CREATE SEQUENCE nexa.shop_page_detail_image_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.shop_shop_seq_seq;

CREATE SEQUENCE nexa.shop_shop_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.sse_history_sse_history_seq_seq;

CREATE SEQUENCE nexa.sse_history_sse_history_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.table_group_table_group_seq_seq;

CREATE SEQUENCE nexa.table_group_table_group_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE nexa.table_info_table_seq_seq;

CREATE SEQUENCE nexa.table_info_table_seq_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;-- nexa.ad_campaign definition

-- Drop table

-- DROP TABLE nexa.ad_campaign;

CREATE TABLE nexa.ad_campaign (
	campaign_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 켐페인 순번 (PK)
	campaign_code varchar(20) NOT NULL, -- 캠페인 코드 (예: CP+yyyyMMdd(오늘날짜)+0000 / CP202604100001, 202604100002, ...)
	campaign_name varchar(100) NOT NULL, -- 캠페인명
	campaign_alias text NULL, -- 광고 별명
	advertiser_name varchar(100) NULL, -- 광고주명
	campaign_memo text NULL, -- 내부 관리용 메모
	start_date timestamptz NOT NULL, -- 캠페인 전체 집행 시작 일시
	end_date timestamptz NULL, -- 캠페인 전체 집행 종료 일시
	campaign_status varchar(20) DEFAULT 'PAUSED'::character varying NOT NULL, -- 캠페인 상태 (대기 : WAITING, 진행 : PROGRESS, 종료 : TERMINATED, 일시정지 : PAUSED)
	is_active bool DEFAULT false NOT NULL, -- 활성화 여부 (ON/OFF)
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	create_date timestamptz DEFAULT now() NOT NULL, -- 등록 일시
	create_member_uuid varchar(50) NULL, -- 등록자 UUID
	update_date timestamptz DEFAULT now() NOT NULL, -- 수정 일시
	update_member_uuid varchar(50) NULL, -- 수정자 UUID
	CONSTRAINT ad_campaign_pkey PRIMARY KEY (campaign_seq)
);
CREATE INDEX idx_ad_campaign_active ON nexa.ad_campaign USING btree (is_active, start_date, end_date) WHERE (is_deleted = false);
CREATE INDEX idx_ad_campaign_status ON nexa.ad_campaign USING btree (campaign_status) WHERE (is_deleted = false);
CREATE UNIQUE INDEX uq_ad_campaign_code ON nexa.ad_campaign USING btree (campaign_code) WHERE ((is_deleted = false) AND ((campaign_code)::text <> '__PENDING__'::text));
COMMENT ON TABLE nexa.ad_campaign IS '광고 캠페인 마스터';

-- Column comments

COMMENT ON COLUMN nexa.ad_campaign.campaign_seq IS '켐페인 순번 (PK)';
COMMENT ON COLUMN nexa.ad_campaign.campaign_code IS '캠페인 코드 (예: CP+yyyyMMdd(오늘날짜)+0000 / CP202604100001, 202604100002, ...)';
COMMENT ON COLUMN nexa.ad_campaign.campaign_name IS '캠페인명';
COMMENT ON COLUMN nexa.ad_campaign.campaign_alias IS '광고 별명';
COMMENT ON COLUMN nexa.ad_campaign.advertiser_name IS '광고주명';
COMMENT ON COLUMN nexa.ad_campaign.campaign_memo IS '내부 관리용 메모';
COMMENT ON COLUMN nexa.ad_campaign.start_date IS '캠페인 전체 집행 시작 일시';
COMMENT ON COLUMN nexa.ad_campaign.end_date IS '캠페인 전체 집행 종료 일시';
COMMENT ON COLUMN nexa.ad_campaign.campaign_status IS '캠페인 상태 (대기 : WAITING, 진행 : PROGRESS, 종료 : TERMINATED, 일시정지 : PAUSED)';
COMMENT ON COLUMN nexa.ad_campaign.is_active IS '활성화 여부 (ON/OFF)';
COMMENT ON COLUMN nexa.ad_campaign.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.ad_campaign.create_date IS '등록 일시';
COMMENT ON COLUMN nexa.ad_campaign.create_member_uuid IS '등록자 UUID';
COMMENT ON COLUMN nexa.ad_campaign.update_date IS '수정 일시';
COMMENT ON COLUMN nexa.ad_campaign.update_member_uuid IS '수정자 UUID';



-- nexa.ad_campaign_content definition

-- Drop table

-- DROP TABLE nexa.ad_campaign_content;

CREATE TABLE nexa.ad_campaign_content (
	content_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 콘텐츠 순번 (PK)
	campaign_seq int8 NOT NULL, -- 캠페인 순번(FK)
	ad_type varchar(50) NOT NULL, -- 광고 유형 (STANDBY_VIDEO, STANDBY_IMAGE, TOP_BANNER_IMAGE, AD_MENU_IMAGE, ORDER_COMP_FULL_VIDEO, ORDER_COMP_FULL_IMAGE, ORDER_COMP_SIDE_IMAGE)
	file_path varchar(300) NULL, -- 파일 경로
	file_name varchar(200) NULL, -- 파일명 (예: 새로_여름.mp4)
	file_size_kb int8 NULL, -- 파일 용량 (KB)
	duration_sec int8 NULL, -- 영상 재생 길이 (초)
	menu_group_seq int8 NULL, -- 메뉴 그룹 순번 (FK)
	sort_order int4 DEFAULT 1 NOT NULL, -- 콘텐츠 정렬 순서
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	create_date timestamptz DEFAULT now() NOT NULL, -- 등록 일시
	create_member_uuid varchar(50) NULL, -- 등록자 UUID
	update_date timestamptz DEFAULT now() NOT NULL, -- 수정 일시
	update_member_uuid varchar(50) NULL, -- 수정자 UUID
	content_description text NULL, -- 광고 설명 문구 (화면에 노출될 홍보 텍스트)
	CONSTRAINT ad_campaign_content_pkey PRIMARY KEY (content_seq)
);
CREATE INDEX idx_ad_campaign_content_campaign_seq ON nexa.ad_campaign_content USING btree (campaign_seq, sort_order) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.ad_campaign_content IS '캠페인 유형별 콘텐츠';

-- Column comments

COMMENT ON COLUMN nexa.ad_campaign_content.content_seq IS '콘텐츠 순번 (PK)';
COMMENT ON COLUMN nexa.ad_campaign_content.campaign_seq IS '캠페인 순번(FK)';
COMMENT ON COLUMN nexa.ad_campaign_content.ad_type IS '광고 유형 (STANDBY_VIDEO, STANDBY_IMAGE, TOP_BANNER_IMAGE, AD_MENU_IMAGE, ORDER_COMP_FULL_VIDEO, ORDER_COMP_FULL_IMAGE, ORDER_COMP_SIDE_IMAGE)';
COMMENT ON COLUMN nexa.ad_campaign_content.file_path IS '파일 경로';
COMMENT ON COLUMN nexa.ad_campaign_content.file_name IS '파일명 (예: 새로_여름.mp4)';
COMMENT ON COLUMN nexa.ad_campaign_content.file_size_kb IS '파일 용량 (KB)';
COMMENT ON COLUMN nexa.ad_campaign_content.duration_sec IS '영상 재생 길이 (초)';
COMMENT ON COLUMN nexa.ad_campaign_content.menu_group_seq IS '메뉴 그룹 순번 (FK)';
COMMENT ON COLUMN nexa.ad_campaign_content.sort_order IS '콘텐츠 정렬 순서';
COMMENT ON COLUMN nexa.ad_campaign_content.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.ad_campaign_content.create_date IS '등록 일시';
COMMENT ON COLUMN nexa.ad_campaign_content.create_member_uuid IS '등록자 UUID';
COMMENT ON COLUMN nexa.ad_campaign_content.update_date IS '수정 일시';
COMMENT ON COLUMN nexa.ad_campaign_content.update_member_uuid IS '수정자 UUID';
COMMENT ON COLUMN nexa.ad_campaign_content.content_description IS '광고 설명 문구 (화면에 노출될 홍보 텍스트)';



-- nexa.ad_campaign_shop definition

-- Drop table

-- DROP TABLE nexa.ad_campaign_shop;

CREATE TABLE nexa.ad_campaign_shop (
	campaign_shop_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 캠페인-매장 할당 순번 (PK)
	campaign_seq int8 NOT NULL, -- 캠페인 순번 (FK)
	shop_seq int8 NOT NULL, -- 매장 순번 (FK)
	start_date timestamptz NULL, -- 매장별 집행 시작 일시 (캠페인 전체 기간보다 우선 적용됨)
	end_date timestamptz NULL, -- 매장별 집행 종료 일시 (캠페인 전체 기간보다 우선 적용됨)
	is_excluded bool DEFAULT false NOT NULL, -- 특정 매장 집행 일시 정지(제외) 여부
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	create_date timestamptz DEFAULT now() NOT NULL, -- 등록 일시
	create_member_uuid varchar(50) NULL, -- 등록자 UUID
	update_date timestamptz DEFAULT now() NOT NULL, -- 수정 일시
	update_member_uuid varchar(50) NULL, -- 수정자 UUID
	shop_group_seq int8 NULL, -- 매장 그룹 순번 (FK, 그룹 미지정 매장의 경우 NULL 허용)
	CONSTRAINT ad_campaign_shop_pkey PRIMARY KEY (campaign_shop_seq)
);
CREATE INDEX idx_ad_campaign_shop_campaign ON nexa.ad_campaign_shop USING btree (campaign_seq, shop_seq, shop_group_seq) WHERE (is_deleted = false);
CREATE INDEX idx_ad_campaign_shop_group ON nexa.ad_campaign_shop USING btree (shop_group_seq) WHERE ((is_deleted = false) AND (shop_group_seq IS NOT NULL));
CREATE INDEX idx_ad_campaign_shop_shop ON nexa.ad_campaign_shop USING btree (shop_seq) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.ad_campaign_shop IS '캠페인별 할당 매장 및 개별 스케줄';

-- Column comments

COMMENT ON COLUMN nexa.ad_campaign_shop.campaign_shop_seq IS '캠페인-매장 할당 순번 (PK)';
COMMENT ON COLUMN nexa.ad_campaign_shop.campaign_seq IS '캠페인 순번 (FK)';
COMMENT ON COLUMN nexa.ad_campaign_shop.shop_seq IS '매장 순번 (FK)';
COMMENT ON COLUMN nexa.ad_campaign_shop.start_date IS '매장별 집행 시작 일시 (캠페인 전체 기간보다 우선 적용됨)';
COMMENT ON COLUMN nexa.ad_campaign_shop.end_date IS '매장별 집행 종료 일시 (캠페인 전체 기간보다 우선 적용됨)';
COMMENT ON COLUMN nexa.ad_campaign_shop.is_excluded IS '특정 매장 집행 일시 정지(제외) 여부';
COMMENT ON COLUMN nexa.ad_campaign_shop.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.ad_campaign_shop.create_date IS '등록 일시';
COMMENT ON COLUMN nexa.ad_campaign_shop.create_member_uuid IS '등록자 UUID';
COMMENT ON COLUMN nexa.ad_campaign_shop.update_date IS '수정 일시';
COMMENT ON COLUMN nexa.ad_campaign_shop.update_member_uuid IS '수정자 UUID';
COMMENT ON COLUMN nexa.ad_campaign_shop.shop_group_seq IS '매장 그룹 순번 (FK, 그룹 미지정 매장의 경우 NULL 허용)';



-- nexa.ad_campaign_shop_exclusion definition

-- Drop table

-- DROP TABLE nexa.ad_campaign_shop_exclusion;

CREATE TABLE nexa.ad_campaign_shop_exclusion (
	exclusion_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 제외 순번 (PK)
	campaign_seq int8 NOT NULL, -- 캠페인 순번 (FK - nexa.ad_campaign 참조)
	shop_seq int8 NOT NULL, -- 매장 순번 (FK - nexa.shop 참조)
	content_seq int8 NOT NULL, -- 제외할 콘텐츠 순번
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	create_date timestamptz DEFAULT now() NOT NULL, -- 등록 일시
	update_date timestamptz DEFAULT now() NOT NULL, -- 수정 일시
	CONSTRAINT ad_campaign_shop_exclusion_pkey PRIMARY KEY (exclusion_seq)
);
CREATE UNIQUE INDEX uq_campaign_shop_exclusion ON nexa.ad_campaign_shop_exclusion USING btree (campaign_seq, shop_seq, content_seq) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.ad_campaign_shop_exclusion IS '매장별 캠페인 내 특정 콘텐츠 순번 제외 관리 (B-03 매장목록 > 이 매장만 제외 기능)';

-- Column comments

COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.exclusion_seq IS '제외 순번 (PK)';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.campaign_seq IS '캠페인 순번 (FK - nexa.ad_campaign 참조)';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.shop_seq IS '매장 순번 (FK - nexa.shop 참조)';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.content_seq IS '제외할 콘텐츠 순번';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.create_date IS '등록 일시';
COMMENT ON COLUMN nexa.ad_campaign_shop_exclusion.update_date IS '수정 일시';



-- nexa.ad_menu_group definition

-- Drop table

-- DROP TABLE nexa.ad_menu_group;

CREATE TABLE nexa.ad_menu_group (
	ad_menu_group_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 광고 메뉴 그룹 순번 (PK)
	ad_menu_group_name varchar(100) NOT NULL, -- 광고 메뉴 그룹명
	ad_menu_group_tag varchar(50) NULL, -- 메뉴그룹태그 (시스템 자동 채번 관리 번호. 예: G00001, G00002, ...)
	is_deleted bool DEFAULT false NOT NULL,
	create_date timestamptz DEFAULT now() NOT NULL,
	create_member_uuid varchar(50) NULL,
	update_date timestamptz DEFAULT now() NOT NULL,
	update_member_uuid varchar(50) NULL,
	CONSTRAINT ad_menu_group_pkey PRIMARY KEY (ad_menu_group_seq)
);
CREATE UNIQUE INDEX idx_ad_menu_group_tag ON nexa.ad_menu_group USING btree (ad_menu_group_tag) WHERE ((is_deleted = false) AND (ad_menu_group_tag IS NOT NULL));
COMMENT ON TABLE nexa.ad_menu_group IS '광고 메뉴 그룹 마스터 테이블';

-- Column comments

COMMENT ON COLUMN nexa.ad_menu_group.ad_menu_group_seq IS '광고 메뉴 그룹 순번 (PK)';
COMMENT ON COLUMN nexa.ad_menu_group.ad_menu_group_name IS '광고 메뉴 그룹명';
COMMENT ON COLUMN nexa.ad_menu_group.ad_menu_group_tag IS '메뉴그룹태그 (시스템 자동 채번 관리 번호. 예: G00001, G00002, ...)';



-- nexa.ad_menu_group_detail definition

-- Drop table

-- DROP TABLE nexa.ad_menu_group_detail;

CREATE TABLE nexa.ad_menu_group_detail (
	ad_menu_group_detail_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 광고 메뉴 그룹 상세 순번 (PK)
	ad_menu_group_seq int8 NOT NULL, -- 광고 메뉴 그룹 순번 (FK)
	menu_seq int8 NOT NULL, -- 메뉴 순번 (FK - nexa.menu 참조)
	sort_seq int4 DEFAULT 0 NOT NULL, -- 그룹 내 메뉴 정렬 순서
	is_deleted bool DEFAULT false NOT NULL,
	create_date timestamptz DEFAULT now() NOT NULL,
	create_member_uuid varchar(50) NULL,
	update_date timestamptz DEFAULT now() NOT NULL,
	update_member_uuid varchar(50) NULL,
	CONSTRAINT ad_menu_group_detail_pkey PRIMARY KEY (ad_menu_group_detail_seq)
);
CREATE INDEX idx_ad_menu_group_detail_group ON nexa.ad_menu_group_detail USING btree (ad_menu_group_seq, sort_seq) WHERE (is_deleted = false);
CREATE INDEX idx_ad_menu_group_detail_menu ON nexa.ad_menu_group_detail USING btree (menu_seq) WHERE (is_deleted = false);
CREATE UNIQUE INDEX uq_ad_menu_group_detail ON nexa.ad_menu_group_detail USING btree (ad_menu_group_seq, menu_seq) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.ad_menu_group_detail IS '광고 메뉴 그룹과 실제 메뉴(nexa.menu) 매핑 테이블';

-- Column comments

COMMENT ON COLUMN nexa.ad_menu_group_detail.ad_menu_group_detail_seq IS '광고 메뉴 그룹 상세 순번 (PK)';
COMMENT ON COLUMN nexa.ad_menu_group_detail.ad_menu_group_seq IS '광고 메뉴 그룹 순번 (FK)';
COMMENT ON COLUMN nexa.ad_menu_group_detail.menu_seq IS '메뉴 순번 (FK - nexa.menu 참조)';
COMMENT ON COLUMN nexa.ad_menu_group_detail.sort_seq IS '그룹 내 메뉴 정렬 순서';



-- nexa.ad_menu_group_shop_sync definition

-- Drop table

-- DROP TABLE nexa.ad_menu_group_shop_sync;

CREATE TABLE nexa.ad_menu_group_shop_sync (
	sync_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	ad_menu_group_seq int8 NOT NULL,
	shop_seq int8 NOT NULL,
	campaign_seq int8 NOT NULL,
	sync_status varchar(20) DEFAULT 'UNREGISTERED'::character varying NOT NULL, -- 동기화 상태 (미등록 : UNREGISTERED, 동기화대기 : PENDING, 완료 : COMPLETED, 실패 : FAILED)
	sync_completed_date timestamptz NULL, -- 동기화 완료 일시
	is_deleted bool DEFAULT false NOT NULL,
	create_date timestamptz DEFAULT now() NOT NULL,
	create_member_uuid varchar(50) NULL,
	update_date timestamptz DEFAULT now() NOT NULL,
	update_member_uuid varchar(50) NULL,
	CONSTRAINT ad_menu_group_shop_sync_pkey PRIMARY KEY (sync_seq)
);
CREATE INDEX idx_ad_menu_group_shop_sync_shop ON nexa.ad_menu_group_shop_sync USING btree (shop_seq) WHERE (is_deleted = false);
CREATE INDEX idx_ad_menu_group_shop_sync_status ON nexa.ad_menu_group_shop_sync USING btree (sync_status) WHERE (is_deleted = false);
CREATE UNIQUE INDEX uq_ad_menu_group_shop_sync ON nexa.ad_menu_group_shop_sync USING btree (campaign_seq, ad_menu_group_seq, shop_seq) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.ad_menu_group_shop_sync IS '광고 메뉴 그룹의 매장별 태그 동기화 상태 관리';

-- Column comments

COMMENT ON COLUMN nexa.ad_menu_group_shop_sync.sync_status IS '동기화 상태 (미등록 : UNREGISTERED, 동기화대기 : PENDING, 완료 : COMPLETED, 실패 : FAILED)';
COMMENT ON COLUMN nexa.ad_menu_group_shop_sync.sync_completed_date IS '동기화 완료 일시';



-- nexa.admin_shop_setting definition

-- Drop table

-- DROP TABLE nexa.admin_shop_setting;

CREATE TABLE nexa.admin_shop_setting (
	shop_seq int8 NOT NULL, -- 매장 SEQ
	use_online_pos_mode bool DEFAULT true NULL, -- 온라인 모드 사용 여부
	router_id varchar(100) NULL, -- 공유기 ID
	router_pw varchar(200) NULL, -- 공유기 PW
	wifi_ssid varchar(100) NULL, -- WIFI SSID
	wifi_pw varchar(100) NULL, -- WIFI PW
	window_asp_id varchar(100) NULL, -- 윈도우 ASP ID
	window_asp_pw varchar(100) NULL, -- 윈도우 ASP PW
	charger_type varchar(20) NULL, -- 충전 수단
	pos_link_type varchar(20) DEFAULT 'NONE'::character varying NULL, -- 포스 연동방식
	update_date timestamp DEFAULT now() NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정회원 UUID
	CONSTRAINT admin_shop_setting_pk PRIMARY KEY (shop_seq)
);
COMMENT ON TABLE nexa.admin_shop_setting IS '(운영자용) 매장 세팅정보';

-- Column comments

COMMENT ON COLUMN nexa.admin_shop_setting.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.admin_shop_setting.use_online_pos_mode IS '온라인 모드 사용 여부';
COMMENT ON COLUMN nexa.admin_shop_setting.router_id IS '공유기 ID';
COMMENT ON COLUMN nexa.admin_shop_setting.router_pw IS '공유기 PW';
COMMENT ON COLUMN nexa.admin_shop_setting.wifi_ssid IS 'WIFI SSID';
COMMENT ON COLUMN nexa.admin_shop_setting.wifi_pw IS 'WIFI PW';
COMMENT ON COLUMN nexa.admin_shop_setting.window_asp_id IS '윈도우 ASP ID';
COMMENT ON COLUMN nexa.admin_shop_setting.window_asp_pw IS '윈도우 ASP PW';
COMMENT ON COLUMN nexa.admin_shop_setting.charger_type IS '충전 수단';
COMMENT ON COLUMN nexa.admin_shop_setting.pos_link_type IS '포스 연동방식';
COMMENT ON COLUMN nexa.admin_shop_setting.update_date IS '수정일시';
COMMENT ON COLUMN nexa.admin_shop_setting.update_member_uuid IS '수정회원 UUID';



-- nexa.app_version definition

-- Drop table

-- DROP TABLE nexa.app_version;

CREATE TABLE nexa.app_version (
	app_version_seq bigserial NOT NULL, -- 앱 버전 SEQ
	"type" varchar(10) NOT NULL, -- 앱 타입 (MENU: 메뉴판 앱, ADMIN : 관리자앱)
	"version" varchar(50) NOT NULL, -- 버전
	download_path varchar(300) NULL, -- 다운로드 경로
	release_note text NULL, -- 릴리즈 노트 내용
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정 일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	title varchar(300) NULL, -- 제목
	deploy_date varchar(20) NULL, -- 배포일시
	view_count int4 NULL, -- 조회수
	checksum varchar(100) NULL, -- 파일검증해시값
	CONSTRAINT app_version_pkey PRIMARY KEY (app_version_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.app_version.app_version_seq IS '앱 버전 SEQ';
COMMENT ON COLUMN nexa.app_version."type" IS '앱 타입 (MENU: 메뉴판 앱, ADMIN : 관리자앱)';
COMMENT ON COLUMN nexa.app_version."version" IS '버전';
COMMENT ON COLUMN nexa.app_version.download_path IS '다운로드 경로';
COMMENT ON COLUMN nexa.app_version.release_note IS '릴리즈 노트 내용';
COMMENT ON COLUMN nexa.app_version.create_date IS '생성일시';
COMMENT ON COLUMN nexa.app_version.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.app_version.update_date IS '수정 일시';
COMMENT ON COLUMN nexa.app_version.update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa.app_version.title IS '제목';
COMMENT ON COLUMN nexa.app_version.deploy_date IS '배포일시';
COMMENT ON COLUMN nexa.app_version.view_count IS '조회수';
COMMENT ON COLUMN nexa.app_version.checksum IS '파일검증해시값';



-- nexa.category_table_map definition

-- Drop table

-- DROP TABLE nexa.category_table_map;

CREATE TABLE nexa.category_table_map (
	category_table_map_seq bigserial NOT NULL, -- 카테고리 테이블 매핑 SEQ
	category_seq int4 NOT NULL, -- 카테고리 SEQ
	shop_seq int4 NOT NULL, -- 매장 SEQ
	table_number varchar(10) NOT NULL, -- 테이블 번호
	CONSTRAINT category_table_map_pkey PRIMARY KEY (category_table_map_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.category_table_map.category_table_map_seq IS '카테고리 테이블 매핑 SEQ';
COMMENT ON COLUMN nexa.category_table_map.category_seq IS '카테고리 SEQ';
COMMENT ON COLUMN nexa.category_table_map.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.category_table_map.table_number IS '테이블 번호';



-- nexa.device_password_fail_log definition

-- Drop table

-- DROP TABLE nexa.device_password_fail_log;

CREATE TABLE nexa.device_password_fail_log (
	device_password_fail_log_seq serial4 NOT NULL,
	android_id varchar(100) NOT NULL,
	shop_seq int4 NOT NULL,
	fail_type varchar(50) NOT NULL,
	create_date timestamp DEFAULT now() NOT NULL,
	CONSTRAINT device_password_fail_log_pkey PRIMARY KEY (device_password_fail_log_seq)
);
CREATE INDEX idx_device_pw_fail_log ON nexa.device_password_fail_log USING btree (android_id, shop_seq, fail_type);


-- nexa.holiday definition

-- Drop table

-- DROP TABLE nexa.holiday;

CREATE TABLE nexa.holiday (
	holiday_seq bigserial NOT NULL, -- 공휴일 SEQ
	holiday_date varchar(10) NULL, -- 공휴일 날짜(YYYYMMDD)
	holiday_name varchar(200) NULL, -- 공휴일 명
	CONSTRAINT holiday_pk PRIMARY KEY (holiday_seq),
	CONSTRAINT holiday_unique UNIQUE (holiday_date, holiday_name)
);

-- Column comments

COMMENT ON COLUMN nexa.holiday.holiday_seq IS '공휴일 SEQ';
COMMENT ON COLUMN nexa.holiday.holiday_date IS '공휴일 날짜(YYYYMMDD)';
COMMENT ON COLUMN nexa.holiday.holiday_name IS '공휴일 명';



-- nexa.locale_shop_map definition

-- Drop table

-- DROP TABLE nexa.locale_shop_map;

CREATE TABLE nexa.locale_shop_map (
	locale_shop_map_seq bigserial NOT NULL, -- 다국어 매장 매핑 SEQ
	shop_seq int4 NOT NULL, -- 매장 SEQ
	locale_code varchar(10) NOT NULL, -- 다국어 코드
	CONSTRAINT locale_shop_map_pkey PRIMARY KEY (locale_shop_map_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.locale_shop_map.locale_shop_map_seq IS '다국어 매장 매핑 SEQ';
COMMENT ON COLUMN nexa.locale_shop_map.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.locale_shop_map.locale_code IS '다국어 코드';



-- nexa."member" definition

-- Drop table

-- DROP TABLE nexa."member";

CREATE TABLE nexa."member" (
	member_uuid varchar(50) DEFAULT gen_random_uuid() NOT NULL, -- 회원 UUID
	member_id varchar(50) NOT NULL, -- 회원 ID
	member_password varchar(200) NOT NULL, -- 회원 비밀번호
	shop_seq int4 NULL, -- 매장 SEQ
	member_role varchar(20) NOT NULL, -- 회원 역할
	member_name varchar(20) NULL, -- 회원 이름
	auth_seq int4 NOT NULL, -- 권한 SEQ
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	is_agreed bool DEFAULT false NOT NULL, -- 약관동의 여부
	member_tel varchar(20) NULL, -- 회원 연락처
	salt varchar(50) NULL, -- salt값
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	password_changed_date timestamp NULL, -- 마지막 비밀번호 변경일시
	member_email varchar(50) NULL, -- 회원 이메일
	member_department varchar(200) NULL, -- 회원 소속
	is_locked bool DEFAULT false NULL,
	CONSTRAINT member_member_id_key UNIQUE (member_id),
	CONSTRAINT member_pkey PRIMARY KEY (member_uuid),
	CONSTRAINT member_shop_seq_key UNIQUE (shop_seq)
);

-- Column comments

COMMENT ON COLUMN nexa."member".member_uuid IS '회원 UUID';
COMMENT ON COLUMN nexa."member".member_id IS '회원 ID';
COMMENT ON COLUMN nexa."member".member_password IS '회원 비밀번호';
COMMENT ON COLUMN nexa."member".shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa."member".member_role IS '회원 역할';
COMMENT ON COLUMN nexa."member".member_name IS '회원 이름';
COMMENT ON COLUMN nexa."member".auth_seq IS '권한 SEQ';
COMMENT ON COLUMN nexa."member".is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa."member".is_agreed IS '약관동의 여부';
COMMENT ON COLUMN nexa."member".member_tel IS '회원 연락처';
COMMENT ON COLUMN nexa."member".salt IS 'salt값';
COMMENT ON COLUMN nexa."member".create_date IS '생성일시';
COMMENT ON COLUMN nexa."member".create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa."member".update_date IS '수정일시';
COMMENT ON COLUMN nexa."member".update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa."member".password_changed_date IS '마지막 비밀번호 변경일시';
COMMENT ON COLUMN nexa."member".member_email IS '회원 이메일';
COMMENT ON COLUMN nexa."member".member_department IS '회원 소속';



-- nexa.member_auth definition

-- Drop table

-- DROP TABLE nexa.member_auth;

CREATE TABLE nexa.member_auth (
	auth_seq bigserial NOT NULL, -- 권한 SEQ
	prev_auth_seq int4 NOT NULL, -- 상위 권한 SEQ
	CONSTRAINT member_auth_pkey PRIMARY KEY (auth_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.member_auth.auth_seq IS '권한 SEQ';
COMMENT ON COLUMN nexa.member_auth.prev_auth_seq IS '상위 권한 SEQ';



-- nexa.menu_image_sample definition

-- Drop table

-- DROP TABLE nexa.menu_image_sample;

CREATE TABLE nexa.menu_image_sample (
	menu_image_sample_seq bigserial NOT NULL,
	category_code varchar(20) NULL,
	image_name varchar(200) NULL,
	image_path varchar(300) NULL,
	image_index int4 NULL,
	CONSTRAINT menu_image_sample_pkey PRIMARY KEY (menu_image_sample_seq)
);



-- nexa."notice" definition

-- Drop table

-- DROP TABLE nexa."notice";

CREATE TABLE nexa."notice" (
	notice_seq bigserial NOT NULL, -- 공지사항 SEQ
	notice_title varchar(200) NOT NULL, -- 공지사항 제목
	notice_content text NOT NULL, -- 공지사항 본문
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NOT NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	board_type varchar(10) NOT NULL, -- 공지사항 유형
	"views" int4 DEFAULT 0 NOT NULL, -- 조회수
	CONSTRAINT notice_pkey PRIMARY KEY (notice_seq)
);

-- Column comments

COMMENT ON COLUMN nexa."notice".notice_seq IS '공지사항 SEQ';
COMMENT ON COLUMN nexa."notice".notice_title IS '공지사항 제목';
COMMENT ON COLUMN nexa."notice".notice_content IS '공지사항 본문';
COMMENT ON COLUMN nexa."notice".create_date IS '생성일시';
COMMENT ON COLUMN nexa."notice".create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa."notice".update_date IS '수정일시';
COMMENT ON COLUMN nexa."notice".update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa."notice".is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa."notice".board_type IS '공지사항 유형';
COMMENT ON COLUMN nexa."notice"."views" IS '조회수';



-- nexa.okpos_order definition

-- Drop table

-- DROP TABLE nexa.okpos_order;

CREATE TABLE nexa.okpos_order (
	order_uuid varchar(50) NOT NULL, -- 주문 UUID
	external_order_seq varchar(10) NOT NULL, -- 오케이포스 주문 순번
	status varchar(10) DEFAULT 'PENDING'::character varying NULL, -- 주문 상태 
	update_date timestamp DEFAULT now() NULL, -- 수정일시
	CONSTRAINT okpos_order_pkey PRIMARY KEY (order_uuid, external_order_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.okpos_order.order_uuid IS '주문 UUID';
COMMENT ON COLUMN nexa.okpos_order.external_order_seq IS '오케이포스 주문 순번';
COMMENT ON COLUMN nexa.okpos_order.status IS '주문 상태 ';
COMMENT ON COLUMN nexa.okpos_order.update_date IS '수정일시';


-- nexa.order_group definition

-- Drop table

-- DROP TABLE nexa.order_group;

CREATE TABLE nexa.order_group (
	order_group_uuid varchar(50) DEFAULT gen_random_uuid() NOT NULL, -- 주문 그룹 UUID
	customer_count int4 NULL, -- 객수
	kids_customer_count int4 NULL, -- 어린이 객수
	shop_seq int4 NOT NULL, -- 매장SEQ
	table_number varchar(10) NOT NULL, -- 테이블 번호
	table_name varchar(20) NOT NULL, -- 테이블 이름
	table_seq int4 NOT NULL, -- 테이블 SEQ
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	CONSTRAINT order_group_pkey PRIMARY KEY (order_group_uuid)
);
CREATE INDEX idx_og_shop_create ON nexa.order_group USING btree (shop_seq, create_date);

-- Column comments

COMMENT ON COLUMN nexa.order_group.order_group_uuid IS '주문 그룹 UUID';
COMMENT ON COLUMN nexa.order_group.customer_count IS '객수';
COMMENT ON COLUMN nexa.order_group.kids_customer_count IS '어린이 객수';
COMMENT ON COLUMN nexa.order_group.shop_seq IS '매장SEQ';
COMMENT ON COLUMN nexa.order_group.table_number IS '테이블 번호';
COMMENT ON COLUMN nexa.order_group.table_name IS '테이블 이름';
COMMENT ON COLUMN nexa.order_group.table_seq IS '테이블 SEQ';
COMMENT ON COLUMN nexa.order_group.create_date IS '생성일시';



-- nexa.order_group_mapping_table definition

-- Drop table

-- DROP TABLE nexa.order_group_mapping_table;

CREATE TABLE nexa.order_group_mapping_table (
	before_order_group_uuid varchar(50) NOT NULL,
	after_order_group_uuid varchar(50) NOT NULL,
	order_group_uuid_status varchar(10) NOT NULL,
	update_date timestamp DEFAULT now() NOT NULL
);



-- nexa.order_group_status definition

-- Drop table

-- DROP TABLE nexa.order_group_status;

CREATE TABLE nexa.order_group_status (
	order_group_uuid varchar(50) NOT NULL, -- 주문 그룹 UUID
	order_group_code varchar(50) NULL, -- 주문 그룹 코드
	order_group_status varchar(20) NOT NULL, -- 주문 그룹 상태(OCCUPIED : 점유중, CLEARED 정상 퇴장, SHARE: 합석, MOVED: 이동, CANCELED_ALL : 전체취소)
	is_cleared bool DEFAULT false NOT NULL, -- 테이블 클리어 여부
	discount_rate int4 DEFAULT 0 NOT NULL, -- 할인률
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	total_amount int8 DEFAULT 0 NULL, -- 총 주문금액
	payment_status varchar(20) NULL, -- 결제 상태(UNPAID: 결제 전, PAID: 결제완료, REFUND: 환불, PART_PAID : 일부 결제, PART_REFUND : 일부 환불)
	CONSTRAINT order_group_status_pkey PRIMARY KEY (order_group_uuid)
);
CREATE INDEX idx_ogs_uuid_status ON nexa.order_group_status USING btree (order_group_uuid, order_group_status, is_cleared);

-- Column comments

COMMENT ON COLUMN nexa.order_group_status.order_group_uuid IS '주문 그룹 UUID';
COMMENT ON COLUMN nexa.order_group_status.order_group_code IS '주문 그룹 코드';
COMMENT ON COLUMN nexa.order_group_status.order_group_status IS '주문 그룹 상태(OCCUPIED : 점유중, CLEARED 정상 퇴장, SHARE: 합석, MOVED: 이동, CANCELED_ALL : 전체취소)';
COMMENT ON COLUMN nexa.order_group_status.is_cleared IS '테이블 클리어 여부';
COMMENT ON COLUMN nexa.order_group_status.discount_rate IS '할인률';
COMMENT ON COLUMN nexa.order_group_status.update_date IS '수정일시';
COMMENT ON COLUMN nexa.order_group_status.total_amount IS '총 주문금액';
COMMENT ON COLUMN nexa.order_group_status.payment_status IS '결제 상태(UNPAID: 결제 전, PAID: 결제완료, REFUND: 환불, PART_PAID : 일부 결제, PART_REFUND : 일부 환불)';



-- nexa.order_info_mapping_table definition

-- Drop table

-- DROP TABLE nexa.order_info_mapping_table;

CREATE TABLE nexa.order_info_mapping_table (
	before_order_uuid varchar(50) NOT NULL,
	after_order_uuid varchar(50) NOT NULL,
	order_uuid_status varchar(10) NOT NULL,
	update_date timestamp DEFAULT now() NOT NULL
);



-- nexa.order_status definition

-- Drop table

-- DROP TABLE nexa.order_status;

CREATE TABLE nexa.order_status (
	order_uuid varchar(50) NOT NULL, -- 주문 UUID
	shop_seq int4 NULL, -- 매장 SEQ
	status varchar(20) NOT NULL, -- 주문상태 (RECEIVED : 접수, COMPLETE : 조리완료(KDS모드용), CANCEL : 취소, POS_CANCEL : 포스 연동으로 인한 자동 취소)
	order_code varchar(20) NULL, -- 주문 코드(주문번호)
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	payment_status varchar(20) NULL, -- 결제 상태(UNPAID: 결제 전, PAID: 결제완료)
	CONSTRAINT order_status_pkey PRIMARY KEY (order_uuid)
);
CREATE INDEX idx_os_order_uuid ON nexa.order_status USING btree (order_uuid, status);

-- Column comments

COMMENT ON COLUMN nexa.order_status.order_uuid IS '주문 UUID';
COMMENT ON COLUMN nexa.order_status.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.order_status.status IS '주문상태 (RECEIVED : 접수, COMPLETE : 조리완료(KDS모드용), CANCEL : 취소, POS_CANCEL : 포스 연동으로 인한 자동 취소)';
COMMENT ON COLUMN nexa.order_status.order_code IS '주문 코드(주문번호)';
COMMENT ON COLUMN nexa.order_status.create_date IS '생성일시';
COMMENT ON COLUMN nexa.order_status.update_date IS '수정일시';
COMMENT ON COLUMN nexa.order_status.payment_status IS '결제 상태(UNPAID: 결제 전, PAID: 결제완료)';



-- nexa.password_fail_log definition

-- Drop table

-- DROP TABLE nexa.password_fail_log;

CREATE TABLE nexa.password_fail_log (
	seq serial4 NOT NULL,
	member_uuid varchar(255) NOT NULL,
	fail_type varchar(50) NOT NULL,
	create_date timestamp DEFAULT now() NULL,
	CONSTRAINT password_fail_log_pkey PRIMARY KEY (seq)
);
CREATE INDEX idx_password_fail_log_member ON nexa.password_fail_log USING btree (member_uuid, fail_type);


-- nexa.payment definition

-- Drop table

-- DROP TABLE nexa.payment;

CREATE TABLE nexa.payment (
	payment_seq bigserial NOT NULL, -- 결제 SEQ
	order_group_uuid varchar(50) NOT NULL, -- 주문그룹 UUID
	payment_type varchar(10) NOT NULL, -- 결제수단 (CASH : 현금, CARD : 카드)
	transaction_amount int8 NOT NULL, -- 결제금액
	transaction_number varchar(100) NULL, -- (카드결제) 거래고유번호
	approval_number varchar(50) NULL, -- (카드결제) 거래승인번호
	card_number varchar(50) NULL, -- (카드결제) 카드번호
	issuer_company varchar(50) NULL, -- (카드결제) 카드발급사
	acquirer_company varchar(50) NULL, -- (카드결제) 카드매입사
	installment_months varchar(50) NULL, -- (카드결제) 할부개월수
	transaction_date varchar(50) NULL, -- (카드결제) 거래일시
	is_canceled bool DEFAULT false NOT NULL, -- 취소 여부
	cancel_date timestamp NULL, -- 취소일시
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	cancel_transaction_number varchar(100) NULL, -- 취소 거래번호
	order_uuid varchar(50) NULL, -- 주문 UUID
	is_deleted bool DEFAULT false NOT NULL, -- 결제 데이터 유효여부(주문번호 변경됨)
	vat_amount int8 DEFAULT 0 NULL, -- 부가세
	CONSTRAINT payment_pkey PRIMARY KEY (payment_seq)
);
CREATE INDEX idx_payment_og_uuid ON nexa.payment USING btree (order_group_uuid);

-- Column comments

COMMENT ON COLUMN nexa.payment.payment_seq IS '결제 SEQ';
COMMENT ON COLUMN nexa.payment.order_group_uuid IS '주문그룹 UUID';
COMMENT ON COLUMN nexa.payment.payment_type IS '결제수단 (CASH : 현금, CARD : 카드)';
COMMENT ON COLUMN nexa.payment.transaction_amount IS '결제금액';
COMMENT ON COLUMN nexa.payment.transaction_number IS '(카드결제) 거래고유번호';
COMMENT ON COLUMN nexa.payment.approval_number IS '(카드결제) 거래승인번호';
COMMENT ON COLUMN nexa.payment.card_number IS '(카드결제) 카드번호';
COMMENT ON COLUMN nexa.payment.issuer_company IS '(카드결제) 카드발급사';
COMMENT ON COLUMN nexa.payment.acquirer_company IS '(카드결제) 카드매입사';
COMMENT ON COLUMN nexa.payment.installment_months IS '(카드결제) 할부개월수';
COMMENT ON COLUMN nexa.payment.transaction_date IS '(카드결제) 거래일시';
COMMENT ON COLUMN nexa.payment.is_canceled IS '취소 여부';
COMMENT ON COLUMN nexa.payment.cancel_date IS '취소일시';
COMMENT ON COLUMN nexa.payment.create_date IS '생성일시';
COMMENT ON COLUMN nexa.payment.cancel_transaction_number IS '취소 거래번호';
COMMENT ON COLUMN nexa.payment.order_uuid IS '주문 UUID';
COMMENT ON COLUMN nexa.payment.is_deleted IS '결제 데이터 유효여부(주문번호 변경됨)';
COMMENT ON COLUMN nexa.payment.vat_amount IS '부가세';



-- nexa.payment_log definition

-- Drop table

-- DROP TABLE nexa.payment_log;

CREATE TABLE nexa.payment_log (
	order_group_uuid varchar(50) NULL, -- 주문그룹 UUID
	payment_method varchar(20) NULL, -- 결제수단 (이지카드 : EASYCARD)
	transaction_type varchar(20) NULL, -- 거래유형 (승인 : APPROVAL, 취소 : CANCEL)
	transaction_data jsonb NULL, -- 거래 데이터 전문
	transaction_date timestamp DEFAULT now() NULL, -- 거래일시
	order_uuid varchar(50) NULL -- 주문 UUID
);
COMMENT ON TABLE nexa.payment_log IS '거래 로그. 거래 발생 시 응답 전문 기록';

-- Column comments

COMMENT ON COLUMN nexa.payment_log.order_group_uuid IS '주문그룹 UUID';
COMMENT ON COLUMN nexa.payment_log.payment_method IS '결제수단 (이지카드 : EASYCARD)';
COMMENT ON COLUMN nexa.payment_log.transaction_type IS '거래유형 (승인 : APPROVAL, 취소 : CANCEL)';
COMMENT ON COLUMN nexa.payment_log.transaction_data IS '거래 데이터 전문';
COMMENT ON COLUMN nexa.payment_log.transaction_date IS '거래일시';
COMMENT ON COLUMN nexa.payment_log.order_uuid IS '주문 UUID';



-- nexa.pos_mapping_data definition

-- Drop table

-- DROP TABLE nexa.pos_mapping_data;

CREATE TABLE nexa.pos_mapping_data (
	mapping_data_seq bigserial NOT NULL, -- 매핑데이터SEQ
	shop_code varchar(50) NULL, -- 매장코드
	"type" varchar(50) NULL, -- 데이터유형
	"data" jsonb NULL, -- 데이터
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	direction varchar(20) NULL, -- 연동 방향 (POS_TO_SERVER : 연동포스->서버, SERVER_TO_POS : 서버->연동포스)
	category varchar(20) NULL, -- 데이터 범주 (MENU : 카테고리, 메뉴 등 / ORDER : 주문)
	order_group_code varchar(50) NULL -- 주문그룹코드
);

-- Column comments

COMMENT ON COLUMN nexa.pos_mapping_data.mapping_data_seq IS '매핑데이터SEQ';
COMMENT ON COLUMN nexa.pos_mapping_data.shop_code IS '매장코드';
COMMENT ON COLUMN nexa.pos_mapping_data."type" IS '데이터유형';
COMMENT ON COLUMN nexa.pos_mapping_data."data" IS '데이터';
COMMENT ON COLUMN nexa.pos_mapping_data.create_date IS '생성일시';
COMMENT ON COLUMN nexa.pos_mapping_data.direction IS '연동 방향 (POS_TO_SERVER : 연동포스->서버, SERVER_TO_POS : 서버->연동포스)';
COMMENT ON COLUMN nexa.pos_mapping_data.category IS '데이터 범주 (MENU : 카테고리, 메뉴 등 / ORDER : 주문)';
COMMENT ON COLUMN nexa.pos_mapping_data.order_group_code IS '주문그룹코드';



-- nexa.schema_migration_history definition

-- Drop table

-- DROP TABLE nexa.schema_migration_history;

CREATE TABLE nexa.schema_migration_history (
	installed_rank int4 NOT NULL,
	"version" varchar(50) NULL,
	description varchar(200) NOT NULL,
	"type" varchar(20) NOT NULL,
	script varchar(1000) NOT NULL,
	checksum int4 NULL,
	installed_by varchar(100) NOT NULL,
	installed_on timestamp DEFAULT now() NOT NULL,
	execution_time int4 NOT NULL,
	success bool NOT NULL,
	CONSTRAINT schema_migration_history_pk PRIMARY KEY (installed_rank)
);
CREATE INDEX schema_migration_history_s_idx ON nexa.schema_migration_history USING btree (success);


-- nexa.shop definition

-- Drop table

-- DROP TABLE nexa.shop;

CREATE TABLE nexa.shop (
	shop_seq bigserial NOT NULL, -- 매장 SEQ
	shop_name varchar(50) NOT NULL, -- 매장명
	is_active bool DEFAULT false NOT NULL, -- 활성화 여부
	address1 varchar(200) NULL, -- 주소1
	address2 varchar(200) NULL, -- 주소2
	business_number varchar(100) NULL, -- 사업자번호
	shop_type varchar(20) NULL, -- 사업자유형
	shop_code varchar(50) NULL, -- 매장 코드
	owner_name varchar(50) NULL, -- 대표자 이름
	is_corporate bool DEFAULT false NOT NULL, -- 법인 여부
	business_type varchar(20) NULL, -- 업종
	manager_name varchar(50) NULL, -- 담당자 이름
	manager_phone_number varchar(50) NULL, -- 담당자 연락처
	shop_email varchar(100) NULL, -- 매장 이메일
	shop_phone_number varchar(50) NULL, -- 매장 연락처
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	use_locale bool DEFAULT false NOT NULL, -- 다국어 사용여부(shopSetting 이동-> 프론트확인후 삭제예정)
	is_test_shop bool DEFAULT false NOT NULL, -- 테스트 매장 여부
	etc_note varchar(1000) NULL, -- 비고
	shop_business_category varchar(20) NULL, -- 사업자 형태 (ex. 프랜차이즈, 직영점, ....)
	shop_business_status varchar(20) NULL, -- 업태
	shop_country_code varchar(20) NULL, -- 매장 국가 코드
	is_early_beta_update bool DEFAULT false NOT NULL, -- 베타 업데이트 여부
	is_early_update bool DEFAULT false NOT NULL, -- 공식 업데이트 여부
	use_datadog bool DEFAULT false NOT NULL, -- 데이터독 사용여부
	shop_search_name varchar(50) NULL, -- 검색용 매장명
	api_token varchar(500) NULL, -- (연동) 포스 API 토큰
	mapped_shop_code varchar(100) NULL, -- (연동) 포스사 매장코드
	mapped_head_code varchar(50) NULL, -- (연동) 본부코드
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	owner_phone_number varchar(50) NULL, -- 대표자 연락처
	area_code varchar(20) NULL, -- 지역코드
	CONSTRAINT shop_pkey PRIMARY KEY (shop_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.shop.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop.shop_name IS '매장명';
COMMENT ON COLUMN nexa.shop.is_active IS '활성화 여부';
COMMENT ON COLUMN nexa.shop.address1 IS '주소1';
COMMENT ON COLUMN nexa.shop.address2 IS '주소2';
COMMENT ON COLUMN nexa.shop.business_number IS '사업자번호';
COMMENT ON COLUMN nexa.shop.shop_type IS '사업자유형';
COMMENT ON COLUMN nexa.shop.shop_code IS '매장 코드';
COMMENT ON COLUMN nexa.shop.owner_name IS '대표자 이름';
COMMENT ON COLUMN nexa.shop.is_corporate IS '법인 여부';
COMMENT ON COLUMN nexa.shop.business_type IS '업종';
COMMENT ON COLUMN nexa.shop.manager_name IS '담당자 이름';
COMMENT ON COLUMN nexa.shop.manager_phone_number IS '담당자 연락처';
COMMENT ON COLUMN nexa.shop.shop_email IS '매장 이메일';
COMMENT ON COLUMN nexa.shop.shop_phone_number IS '매장 연락처';
COMMENT ON COLUMN nexa.shop.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.shop.use_locale IS '다국어 사용여부(shopSetting 이동-> 프론트확인후 삭제예정)';
COMMENT ON COLUMN nexa.shop.is_test_shop IS '테스트 매장 여부';
COMMENT ON COLUMN nexa.shop.etc_note IS '비고';
COMMENT ON COLUMN nexa.shop.shop_business_category IS '사업자 형태 (ex. 프랜차이즈, 직영점, ....)';
COMMENT ON COLUMN nexa.shop.shop_business_status IS '업태';
COMMENT ON COLUMN nexa.shop.shop_country_code IS '매장 국가 코드';
COMMENT ON COLUMN nexa.shop.is_early_beta_update IS '베타 업데이트 여부';
COMMENT ON COLUMN nexa.shop.is_early_update IS '공식 업데이트 여부';
COMMENT ON COLUMN nexa.shop.use_datadog IS '데이터독 사용여부';
COMMENT ON COLUMN nexa.shop.shop_search_name IS '검색용 매장명';
COMMENT ON COLUMN nexa.shop.api_token IS '(연동) 포스 API 토큰';
COMMENT ON COLUMN nexa.shop.mapped_shop_code IS '(연동) 포스사 매장코드';
COMMENT ON COLUMN nexa.shop.mapped_head_code IS '(연동) 본부코드';
COMMENT ON COLUMN nexa.shop.create_date IS '생성일시';
COMMENT ON COLUMN nexa.shop.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.shop.update_date IS '수정일시';
COMMENT ON COLUMN nexa.shop.update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa.shop.owner_phone_number IS '대표자 연락처';
COMMENT ON COLUMN nexa.shop.area_code IS '지역코드';



-- nexa.shop_group definition

-- Drop table

-- DROP TABLE nexa.shop_group;

CREATE TABLE nexa.shop_group (
	shop_group_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL, -- 매장 그룹 SEQ (PK)
	group_id varchar(50) NOT NULL, -- 매장 그룹 ID (표출용)
	group_name varchar(100) NOT NULL, -- 매장 그룹명
	group_description text NULL, -- 매장 그룹 설명
	is_deleted bool DEFAULT false NOT NULL,
	create_date timestamptz DEFAULT now() NOT NULL,
	create_member_uuid varchar(50) NULL,
	update_date timestamptz DEFAULT now() NOT NULL,
	update_member_uuid varchar(50) NULL,
	CONSTRAINT shop_group_pkey PRIMARY KEY (shop_group_seq)
);
CREATE UNIQUE INDEX uq_shop_group_group_id ON nexa.shop_group USING btree (group_id) WHERE ((is_deleted = false) AND ((group_id)::text <> '__PENDING__'::text));
COMMENT ON TABLE nexa.shop_group IS '매장 그룹 마스터';

-- Column comments

COMMENT ON COLUMN nexa.shop_group.shop_group_seq IS '매장 그룹 SEQ (PK)';
COMMENT ON COLUMN nexa.shop_group.group_id IS '매장 그룹 ID (표출용)';
COMMENT ON COLUMN nexa.shop_group.group_name IS '매장 그룹명';
COMMENT ON COLUMN nexa.shop_group.group_description IS '매장 그룹 설명';



-- nexa.shop_group_map definition

-- Drop table

-- DROP TABLE nexa.shop_group_map;

CREATE TABLE nexa.shop_group_map (
	shop_group_map_seq int8 GENERATED ALWAYS AS IDENTITY( INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 1 CACHE 1 NO CYCLE) NOT NULL,
	shop_group_seq int8 NOT NULL, -- 매장 그룹 SEQ
	shop_seq int8 NOT NULL, -- 매장 SEQ
	is_deleted bool DEFAULT false NOT NULL,
	create_date timestamptz DEFAULT now() NOT NULL,
	create_member_uuid varchar(50) NULL,
	update_date timestamptz DEFAULT now() NOT NULL,
	update_member_uuid varchar(50) NULL,
	CONSTRAINT shop_group_map_pkey PRIMARY KEY (shop_group_map_seq)
);
CREATE INDEX idx_shop_group_map_group ON nexa.shop_group_map USING btree (shop_group_seq);
CREATE INDEX idx_shop_group_map_shop ON nexa.shop_group_map USING btree (shop_seq);
CREATE INDEX idx_shop_group_map_shop_seq ON nexa.shop_group_map USING btree (shop_seq) WHERE (is_deleted = false);
CREATE UNIQUE INDEX uq_shop_group_map ON nexa.shop_group_map USING btree (shop_group_seq, shop_seq) WHERE (is_deleted = false);
COMMENT ON TABLE nexa.shop_group_map IS '매장 그룹 - 매장 매핑';

-- Column comments

COMMENT ON COLUMN nexa.shop_group_map.shop_group_seq IS '매장 그룹 SEQ';
COMMENT ON COLUMN nexa.shop_group_map.shop_seq IS '매장 SEQ';



-- nexa.shop_page_detail definition

-- Drop table

-- DROP TABLE nexa.shop_page_detail;

CREATE TABLE nexa.shop_page_detail (
	page_detail_image_seq int8 DEFAULT nextval('shop_page_detail_image_seq_seq'::regclass) NOT NULL,
	shop_seq int4 NOT NULL,
	page_detail_type varchar(50) NOT NULL, -- 타입: INIT_COMMON, INIT_LIGHT, INIT_DARK, ORDER_COMPLETE
	page_detail_image_path varchar(300) NULL, -- 이미지명은 타임스탬프이고, 확장자포함 경로임
	page_detail_description varchar(200) NULL, -- LIGHT, DARK는 매장명 기입, 그외는 설명 기입
	page_detail_image_file_index int4 NULL, -- INIT_COMMON 조회용 순서 저장컬럼
	CONSTRAINT shop_page_detail_pk PRIMARY KEY (page_detail_image_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.shop_page_detail.page_detail_type IS '타입: INIT_COMMON, INIT_LIGHT, INIT_DARK, ORDER_COMPLETE';
COMMENT ON COLUMN nexa.shop_page_detail.page_detail_image_path IS '이미지명은 타임스탬프이고, 확장자포함 경로임';
COMMENT ON COLUMN nexa.shop_page_detail.page_detail_description IS 'LIGHT, DARK는 매장명 기입, 그외는 설명 기입';
COMMENT ON COLUMN nexa.shop_page_detail.page_detail_image_file_index IS 'INIT_COMMON 조회용 순서 저장컬럼';



-- nexa.shop_theme_menu definition

-- Drop table

-- DROP TABLE nexa.shop_theme_menu;

CREATE TABLE nexa.shop_theme_menu (
	shop_seq int4 NOT NULL, -- 매장 SEQ
	logo_image_path varchar(200) NULL, -- 메뉴판 좌측상단 로고 이미지 경로
	use_dark_theme bool DEFAULT false NOT NULL, -- 다크테마 사용여부
	menuboard_template_type varchar(20) DEFAULT 'DEFAULT'::character varying NOT NULL, -- 메뉴판 템플릿 유형 (가로형 : "DEFAULT", 세로형 텍스트 : "VERTICAL_TEXT", 세로형 이미지 : "VERTICAL_IMAGE")
	is_menu_three_column_layout bool DEFAULT true NOT NULL, -- 3열 배치 여부
	CONSTRAINT shop_theme_menu_unique UNIQUE (shop_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.shop_theme_menu.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop_theme_menu.logo_image_path IS '메뉴판 좌측상단 로고 이미지 경로';
COMMENT ON COLUMN nexa.shop_theme_menu.use_dark_theme IS '다크테마 사용여부';
COMMENT ON COLUMN nexa.shop_theme_menu.menuboard_template_type IS '메뉴판 템플릿 유형 (가로형 : "DEFAULT", 세로형 텍스트 : "VERTICAL_TEXT", 세로형 이미지 : "VERTICAL_IMAGE")';
COMMENT ON COLUMN nexa.shop_theme_menu.is_menu_three_column_layout IS '3열 배치 여부';



-- nexa.shop_time_break_time definition

-- Drop table

-- DROP TABLE nexa.shop_time_break_time;

CREATE TABLE nexa.shop_time_break_time (
	shop_seq int4 NOT NULL, -- 매장 SEQ
	day_of_week int4 NOT NULL, -- 적용 요일(0:일요일 ~ 6:토요일)
	break_start_time varchar(10) NOT NULL, -- 브레이크타임 시작시간 (HHmm)
	break_end_time varchar(10) NOT NULL, -- 브레이크타임 종료시간 (HHmm)
	is_active bool DEFAULT false NOT NULL, -- 활성화 여부
	CONSTRAINT shop_time_break_time_pk UNIQUE (shop_seq, day_of_week)
);
COMMENT ON TABLE nexa.shop_time_break_time IS '매장 브레이크타임 정보';

-- Column comments

COMMENT ON COLUMN nexa.shop_time_break_time.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop_time_break_time.day_of_week IS '적용 요일(0:일요일 ~ 6:토요일)';
COMMENT ON COLUMN nexa.shop_time_break_time.break_start_time IS '브레이크타임 시작시간 (HHmm)';
COMMENT ON COLUMN nexa.shop_time_break_time.break_end_time IS '브레이크타임 종료시간 (HHmm)';
COMMENT ON COLUMN nexa.shop_time_break_time.is_active IS '활성화 여부';



-- nexa.sse_history definition

-- Drop table

-- DROP TABLE nexa.sse_history;

CREATE TABLE nexa.sse_history (
	sse_history_seq bigserial NOT NULL,
	shop_code varchar(50) NOT NULL,
	event_type varchar(20) NOT NULL,
	"data" jsonb NULL,
	send_date timestamp DEFAULT now() NULL,
	CONSTRAINT sse_history_pkey PRIMARY KEY (sse_history_seq)
);



-- nexa.table_group definition

-- Drop table

-- DROP TABLE nexa.table_group;

CREATE TABLE nexa.table_group (
	table_group_seq bigserial NOT NULL, -- 테이블 그룹 SEQ
	shop_seq int4 NOT NULL, -- 매장 SEQ
	table_group_name varchar(20) NOT NULL, -- 테이블 그룹 이름
	mapped_group_id varchar(20) NULL, -- (연동) 테이블 그룹 ID
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	CONSTRAINT table_group_pkey PRIMARY KEY (table_group_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.table_group.table_group_seq IS '테이블 그룹 SEQ';
COMMENT ON COLUMN nexa.table_group.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.table_group.table_group_name IS '테이블 그룹 이름';
COMMENT ON COLUMN nexa.table_group.mapped_group_id IS '(연동) 테이블 그룹 ID';
COMMENT ON COLUMN nexa.table_group.is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa.table_group.create_date IS '생성일시';
COMMENT ON COLUMN nexa.table_group.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.table_group.update_date IS '수정일시';
COMMENT ON COLUMN nexa.table_group.update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa.table_group.is_deleted IS '삭제 여부';



-- nexa.category definition

-- Drop table

-- DROP TABLE nexa.category;

CREATE TABLE nexa.category (
	category_seq bigserial NOT NULL, -- 카테고리 SEQ
	shop_seq int4 NOT NULL, -- 매장 SEQ
	category_name varchar(50) NOT NULL, -- 카테고리명
	"index" int4 NOT NULL, -- 정렬순번
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	mapped_category_code varchar(20) NULL, -- (연동) 카테고리 코드
	mapped_category_name varchar(200) NULL, -- (연동) 카테고리 이름
	mapped_upt_dt varchar(50) NULL, -- (연동) 업데이트 일시
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	is_hidden bool DEFAULT false NOT NULL, -- 숨김 여부
	use_sale_day bool DEFAULT false NOT NULL, -- 판매 요일 설정 여부
	sale_day_of_week _int4 NULL, -- 판매 요일 배열 (0:월요일 ~ 6: 일요일)
	use_sale_time bool DEFAULT false NOT NULL,
	sale_start_time varchar(10) NULL, -- 판매 시작 시간
	sale_end_time varchar(10) NULL, -- 판매 종료 시간
	is_sale_on_holiday bool DEFAULT false NOT NULL, -- 공휴일 판매 여부
	use_two_column_layout bool DEFAULT false NOT NULL, -- 2열배치 사용여부
	is_quantity_selectable bool DEFAULT false NOT NULL, -- 수량 선택 여부
	is_staff_call bool DEFAULT false NOT NULL, -- 직원호출 카테고리 여부
	category_description varchar(500) NULL, -- 카테고리 설명
	is_first_order_required bool DEFAULT false NOT NULL, -- 첫주문 필수 여부
	locale_category_name jsonb NULL, -- 다국어 카테고리 이름
	locale_category_description jsonb NULL, -- 다국어 카테고리 설명
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NOT NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	CONSTRAINT category_pkey PRIMARY KEY (category_seq),
	CONSTRAINT category_shop_seq_fkey FOREIGN KEY (shop_seq) REFERENCES nexa.shop(shop_seq) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_category_mapped_category_code_notnull ON nexa.category USING btree (mapped_category_code, shop_seq) WHERE (mapped_category_code IS NOT NULL);

-- Column comments

COMMENT ON COLUMN nexa.category.category_seq IS '카테고리 SEQ';
COMMENT ON COLUMN nexa.category.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.category.category_name IS '카테고리명';
COMMENT ON COLUMN nexa.category."index" IS '정렬순번';
COMMENT ON COLUMN nexa.category.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.category.mapped_category_code IS '(연동) 카테고리 코드';
COMMENT ON COLUMN nexa.category.mapped_category_name IS '(연동) 카테고리 이름';
COMMENT ON COLUMN nexa.category.mapped_upt_dt IS '(연동) 업데이트 일시';
COMMENT ON COLUMN nexa.category.is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa.category.is_hidden IS '숨김 여부';
COMMENT ON COLUMN nexa.category.use_sale_day IS '판매 요일 설정 여부';
COMMENT ON COLUMN nexa.category.sale_day_of_week IS '판매 요일 배열 (0:월요일 ~ 6: 일요일)';
COMMENT ON COLUMN nexa.category.sale_start_time IS '판매 시작 시간';
COMMENT ON COLUMN nexa.category.sale_end_time IS '판매 종료 시간';
COMMENT ON COLUMN nexa.category.is_sale_on_holiday IS '공휴일 판매 여부';
COMMENT ON COLUMN nexa.category.use_two_column_layout IS '2열배치 사용여부';
COMMENT ON COLUMN nexa.category.is_quantity_selectable IS '수량 선택 여부';
COMMENT ON COLUMN nexa.category.is_staff_call IS '직원호출 카테고리 여부';
COMMENT ON COLUMN nexa.category.category_description IS '카테고리 설명';
COMMENT ON COLUMN nexa.category.is_first_order_required IS '첫주문 필수 여부';
COMMENT ON COLUMN nexa.category.locale_category_name IS '다국어 카테고리 이름';
COMMENT ON COLUMN nexa.category.locale_category_description IS '다국어 카테고리 설명';
COMMENT ON COLUMN nexa.category.create_date IS '생성일시';
COMMENT ON COLUMN nexa.category.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.category.update_date IS '수정일시';
COMMENT ON COLUMN nexa.category.update_member_uuid IS '수정 회원 UUID';



-- nexa.device definition

-- Drop table

-- DROP TABLE nexa.device;

CREATE TABLE nexa.device (
	device_seq bigserial NOT NULL, -- 기기 SEQ
	android_id varchar(50) NOT NULL, -- 안드로이드 ID
	shop_seq int4 NOT NULL, -- 매장 SEQ
	device_type varchar(20) NOT NULL, -- 기기유형 (ORDERPOS : 오더포스, POSAPP : 포스앱, MENU : 메뉴판)
	table_number varchar(10) NULL, -- 테이블 번호 (null인 경우 포스앱)
	battery int4 NULL, -- 배터리
	wifi_signal varchar(200) NOT NULL, -- 와이파이 신호 강도
	ip_address varchar(20) NOT NULL, -- IP 주소
	"version" varchar(50) NOT NULL, -- 버전
	build_number varchar(100) NOT NULL, -- 빌드번호
	update_date timestamp NOT NULL, -- 갱신일시
	order_pos_number varchar(10) NULL, -- 오더포스번호
	is_active bool DEFAULT true NULL,
	control_status varchar(20) NULL, -- 기기제어 상태 코드 (UPDATING : 앱 업데이트 진행 중, REBOOTING : 재부팅 진행 중, FAIL : 실패, SUCCESS : 성공)
	CONSTRAINT device_pkey PRIMARY KEY (device_seq),
	CONSTRAINT device_shop_seq_fkey FOREIGN KEY (shop_seq) REFERENCES nexa.shop(shop_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.device.device_seq IS '기기 SEQ';
COMMENT ON COLUMN nexa.device.android_id IS '안드로이드 ID';
COMMENT ON COLUMN nexa.device.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.device.device_type IS '기기유형 (ORDERPOS : 오더포스, POSAPP : 포스앱, MENU : 메뉴판)';
COMMENT ON COLUMN nexa.device.table_number IS '테이블 번호 (null인 경우 포스앱)';
COMMENT ON COLUMN nexa.device.battery IS '배터리';
COMMENT ON COLUMN nexa.device.wifi_signal IS '와이파이 신호 강도';
COMMENT ON COLUMN nexa.device.ip_address IS 'IP 주소';
COMMENT ON COLUMN nexa.device."version" IS '버전';
COMMENT ON COLUMN nexa.device.build_number IS '빌드번호';
COMMENT ON COLUMN nexa.device.update_date IS '갱신일시';
COMMENT ON COLUMN nexa.device.order_pos_number IS '오더포스번호';
COMMENT ON COLUMN nexa.device.control_status IS '기기제어 상태 코드 (UPDATING : 앱 업데이트 진행 중, REBOOTING : 재부팅 진행 중, FAIL : 실패, SUCCESS : 성공)';



-- nexa.menu definition

-- Drop table

-- DROP TABLE nexa.menu;

CREATE TABLE nexa.menu (
	menu_seq bigserial NOT NULL, -- 메뉴 SEQ
	menu_name varchar(50) NULL, -- 메뉴 이름
	category_seq int4 NOT NULL, -- 카테고리 SEQ
	menu_price int8 NOT NULL, -- 메뉴 가격
	is_recommended bool DEFAULT false NOT NULL, -- 추천 메뉴 여부
	menu_description varchar(500) NULL, -- 메뉴 설명
	is_out_of_stock bool DEFAULT false NOT NULL, -- 품절 여부
	"index" int4 NOT NULL, -- 정렬순번
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	mapped_menu_code varchar(20) NULL, -- (연동) 메뉴 코드
	mapped_menu_name varchar(200) NULL, -- (연동) 메뉴 이름
	mapped_category_code varchar(20) NULL, -- (연동) 카테고리 코드
	mapped_option_group_code varchar(20) NULL, -- (연동) 옵션그룹 코드
	mapped_upt_dt varchar(50) NULL, -- (연동) 업데이트 일시
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	is_hidden bool DEFAULT false NOT NULL, -- 숨김 여부
	is_best bool DEFAULT false NOT NULL, -- 인기메뉴 여부
	is_new bool DEFAULT false NOT NULL, -- 신메뉴 여부
	spice_level int4 NOT NULL, -- 맵기
	is_tax_free bool DEFAULT false NOT NULL, -- 면세 여부
	min_quantity int4 NOT NULL, -- 최소 수량
	touch_key_color_code varchar(10) NULL, -- 터치키 색상 코드
	locale_menu_name jsonb NULL, -- 다국어 메뉴 이름
	locale_menu_description jsonb NULL, -- 다국어 메뉴 설명
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	CONSTRAINT menu_pkey PRIMARY KEY (menu_seq),
	CONSTRAINT menu_category_seq_fkey FOREIGN KEY (category_seq) REFERENCES nexa.category(category_seq) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_menu_mapped_menu_code_notnull ON nexa.menu USING btree (mapped_menu_code, category_seq) WHERE (mapped_menu_code IS NOT NULL);

-- Column comments

COMMENT ON COLUMN nexa.menu.menu_seq IS '메뉴 SEQ';
COMMENT ON COLUMN nexa.menu.menu_name IS '메뉴 이름';
COMMENT ON COLUMN nexa.menu.category_seq IS '카테고리 SEQ';
COMMENT ON COLUMN nexa.menu.menu_price IS '메뉴 가격';
COMMENT ON COLUMN nexa.menu.is_recommended IS '추천 메뉴 여부';
COMMENT ON COLUMN nexa.menu.menu_description IS '메뉴 설명';
COMMENT ON COLUMN nexa.menu.is_out_of_stock IS '품절 여부';
COMMENT ON COLUMN nexa.menu."index" IS '정렬순번';
COMMENT ON COLUMN nexa.menu.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.menu.mapped_menu_code IS '(연동) 메뉴 코드';
COMMENT ON COLUMN nexa.menu.mapped_menu_name IS '(연동) 메뉴 이름';
COMMENT ON COLUMN nexa.menu.mapped_category_code IS '(연동) 카테고리 코드';
COMMENT ON COLUMN nexa.menu.mapped_option_group_code IS '(연동) 옵션그룹 코드';
COMMENT ON COLUMN nexa.menu.mapped_upt_dt IS '(연동) 업데이트 일시';
COMMENT ON COLUMN nexa.menu.is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa.menu.is_hidden IS '숨김 여부';
COMMENT ON COLUMN nexa.menu.is_best IS '인기메뉴 여부';
COMMENT ON COLUMN nexa.menu.is_new IS '신메뉴 여부';
COMMENT ON COLUMN nexa.menu.spice_level IS '맵기';
COMMENT ON COLUMN nexa.menu.is_tax_free IS '면세 여부';
COMMENT ON COLUMN nexa.menu.min_quantity IS '최소 수량';
COMMENT ON COLUMN nexa.menu.touch_key_color_code IS '터치키 색상 코드';
COMMENT ON COLUMN nexa.menu.locale_menu_name IS '다국어 메뉴 이름';
COMMENT ON COLUMN nexa.menu.locale_menu_description IS '다국어 메뉴 설명';
COMMENT ON COLUMN nexa.menu.create_date IS '생성일시';
COMMENT ON COLUMN nexa.menu.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.menu.update_date IS '수정일시';
COMMENT ON COLUMN nexa.menu.update_member_uuid IS '수정 회원 UUID';



-- nexa.menu_image definition

-- Drop table

-- DROP TABLE nexa.menu_image;

CREATE TABLE nexa.menu_image (
	image_seq bigserial NOT NULL, -- 이미지 SEQ
	menu_seq int4 NOT NULL, -- 메뉴 SEQ
	image_path varchar(300) NULL, -- 이미지경로
	image_name varchar(200) NULL, -- 이미지명
	image_extension varchar(10) NULL, -- 이미지 확장자
	image_index int4 NULL, -- 이미지 순서
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	is_main_image bool DEFAULT false NOT NULL, -- 메인 이미지 여부
	CONSTRAINT menu_image_pkey PRIMARY KEY (image_seq),
	CONSTRAINT menu_image_menu_seq_fkey FOREIGN KEY (menu_seq) REFERENCES nexa.menu(menu_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.menu_image.image_seq IS '이미지 SEQ';
COMMENT ON COLUMN nexa.menu_image.menu_seq IS '메뉴 SEQ';
COMMENT ON COLUMN nexa.menu_image.image_path IS '이미지경로';
COMMENT ON COLUMN nexa.menu_image.image_name IS '이미지명';
COMMENT ON COLUMN nexa.menu_image.image_extension IS '이미지 확장자';
COMMENT ON COLUMN nexa.menu_image.image_index IS '이미지 순서';
COMMENT ON COLUMN nexa.menu_image.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.menu_image.is_main_image IS '메인 이미지 여부';



-- nexa.option_group definition

-- Drop table

-- DROP TABLE nexa.option_group;

CREATE TABLE nexa.option_group (
	option_group_seq bigserial NOT NULL, -- 옵션그룹 SEQ
	option_group_name varchar(50) NOT NULL, -- 옵션그룹 이름
	menu_seq int4 NULL, -- 메뉴 SEQ
	"index" int4 NOT NULL, -- 정렬순번
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	mapped_option_group_code varchar(20) NULL, -- (연동) 옵션그룹 코드
	mapped_option_group_name varchar(200) NULL, -- (연동) 옵션그룹 이름
	mapped_head_option_group_code varchar(20) NULL, -- (연동) 상위 옵션그룹 코드
	mapped_upt_dt varchar(50) NULL, -- (연동) 업데이트 일시
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	min_quantity int4 DEFAULT 0 NOT NULL, -- 최소 선택 수량
	max_quantity int4 DEFAULT 0 NOT NULL, -- 최대 선택 수량
	is_multiple_selectable bool DEFAULT false NOT NULL, -- 다중 선택 가능 여부
	is_option_quantity_selectable bool DEFAULT false NOT NULL, -- 옵션 수량 선택 가능 여부
	is_menu_quantity_independent bool DEFAULT false NOT NULL, -- 메뉴 수량 독립 여부
	locale_option_group_name jsonb NULL, -- 다국어 옵션 그룹 이름
	locale_option_group_description jsonb NULL, -- 다국어 옵션 그룹 설명
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	CONSTRAINT option_group_pkey PRIMARY KEY (option_group_seq),
	CONSTRAINT option_group_menu_seq_fkey FOREIGN KEY (menu_seq) REFERENCES nexa.menu(menu_seq) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_option_group_mapped_option_group_code_notnull ON nexa.option_group USING btree (mapped_option_group_code, menu_seq) WHERE (mapped_option_group_code IS NOT NULL);

-- Column comments

COMMENT ON COLUMN nexa.option_group.option_group_seq IS '옵션그룹 SEQ';
COMMENT ON COLUMN nexa.option_group.option_group_name IS '옵션그룹 이름';
COMMENT ON COLUMN nexa.option_group.menu_seq IS '메뉴 SEQ';
COMMENT ON COLUMN nexa.option_group."index" IS '정렬순번';
COMMENT ON COLUMN nexa.option_group.is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa.option_group.mapped_option_group_code IS '(연동) 옵션그룹 코드';
COMMENT ON COLUMN nexa.option_group.mapped_option_group_name IS '(연동) 옵션그룹 이름';
COMMENT ON COLUMN nexa.option_group.mapped_head_option_group_code IS '(연동) 상위 옵션그룹 코드';
COMMENT ON COLUMN nexa.option_group.mapped_upt_dt IS '(연동) 업데이트 일시';
COMMENT ON COLUMN nexa.option_group.is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa.option_group.min_quantity IS '최소 선택 수량';
COMMENT ON COLUMN nexa.option_group.max_quantity IS '최대 선택 수량';
COMMENT ON COLUMN nexa.option_group.is_multiple_selectable IS '다중 선택 가능 여부';
COMMENT ON COLUMN nexa.option_group.is_option_quantity_selectable IS '옵션 수량 선택 가능 여부';
COMMENT ON COLUMN nexa.option_group.is_menu_quantity_independent IS '메뉴 수량 독립 여부';
COMMENT ON COLUMN nexa.option_group.locale_option_group_name IS '다국어 옵션 그룹 이름';
COMMENT ON COLUMN nexa.option_group.locale_option_group_description IS '다국어 옵션 그룹 설명';
COMMENT ON COLUMN nexa.option_group.create_date IS '생성일시';
COMMENT ON COLUMN nexa.option_group.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.option_group.update_date IS '수정일시';
COMMENT ON COLUMN nexa.option_group.update_member_uuid IS '수정 회원 UUID';



-- nexa.order_info definition

-- Drop table

-- DROP TABLE nexa.order_info;

CREATE TABLE nexa.order_info (
	order_uuid varchar(50) DEFAULT gen_random_uuid() NOT NULL, -- 주문 UUID
	order_group_uuid varchar(50) NOT NULL, -- 주문 그룹 UUID
	shop_seq int4 NOT NULL, -- 매장 SEQ
	table_seq int4 NOT NULL, -- 테이블 SEQ
	table_number varchar(10) NOT NULL, -- 테이블 번호
	order_type varchar(20) NOT NULL, -- 주문 유형 (ex. POS : 연동포스, POS_APP : 관리자앱,ORDER_POS : 오더포스, MENU : 메뉴판, CUSTOM_AMOUNT : 금액 변경 ,PREPAYMENT : 선결제 ,TEST : 온보딩 테스트 )
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	total_amount int8 DEFAULT 0 NOT NULL, -- 주문 총 금액
	CONSTRAINT order_info_pkey PRIMARY KEY (order_uuid),
	CONSTRAINT order_info_order_group_uuid_fkey FOREIGN KEY (order_group_uuid) REFERENCES nexa.order_group(order_group_uuid) ON DELETE CASCADE
);
CREATE INDEX idx_oi_og_uuid ON nexa.order_info USING btree (order_group_uuid);

-- Column comments

COMMENT ON COLUMN nexa.order_info.order_uuid IS '주문 UUID';
COMMENT ON COLUMN nexa.order_info.order_group_uuid IS '주문 그룹 UUID';
COMMENT ON COLUMN nexa.order_info.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.order_info.table_seq IS '테이블 SEQ';
COMMENT ON COLUMN nexa.order_info.table_number IS '테이블 번호';
COMMENT ON COLUMN nexa.order_info.order_type IS '주문 유형 (ex. POS : 연동포스, POS_APP : 관리자앱,ORDER_POS : 오더포스, MENU : 메뉴판, CUSTOM_AMOUNT : 금액 변경 ,PREPAYMENT : 선결제 ,TEST : 온보딩 테스트 )';
COMMENT ON COLUMN nexa.order_info.create_date IS '생성일시';
COMMENT ON COLUMN nexa.order_info.total_amount IS '주문 총 금액';



-- nexa.shop_network definition

-- Drop table

-- DROP TABLE nexa.shop_network;

CREATE TABLE nexa.shop_network (
	shop_seq int4 NOT NULL, -- 매장 SEQ
	network_type varchar(10) DEFAULT 'AUTO'::character varying NOT NULL, -- 네트워크 타입 (자동 : AUTO, 유선 : LAN, 무선 : WIFI)
	ssid varchar(100) NULL, -- SSID
	ip_address varchar(20) NULL, -- IP 주소
	CONSTRAINT shop_network_pkey PRIMARY KEY (shop_seq),
	CONSTRAINT shop_network_shop_seq_fkey FOREIGN KEY (shop_seq) REFERENCES nexa.shop(shop_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.shop_network.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop_network.network_type IS '네트워크 타입 (자동 : AUTO, 유선 : LAN, 무선 : WIFI)';
COMMENT ON COLUMN nexa.shop_network.ssid IS 'SSID';
COMMENT ON COLUMN nexa.shop_network.ip_address IS 'IP 주소';



-- nexa.shop_page definition

-- Drop table

-- DROP TABLE nexa.shop_page;

CREATE TABLE nexa.shop_page (
	shop_seq int4 NOT NULL,
	init_page_layout varchar(50) NOT NULL, -- 시작 페이지 레이아웃 코드 (LIGHT, DARK, IMAGE)
	order_complete_page_layout varchar(50) NOT NULL, -- 주문완료 페이지 레이아웃 (DEFAULT, RECEIPT)
	logo_image_path varchar(200) NULL, -- (shop_theme_menu로 이동, 프론트 작업 후 삭제예정)메뉴판 좌측상단 로고 이미지 경로
	CONSTRAINT shop_page_pk PRIMARY KEY (shop_seq),
	CONSTRAINT shop_page_shop_page_fk FOREIGN KEY (shop_seq) REFERENCES nexa.shop_page(shop_seq)
);

-- Column comments

COMMENT ON COLUMN nexa.shop_page.init_page_layout IS '시작 페이지 레이아웃 코드 (LIGHT, DARK, IMAGE)';
COMMENT ON COLUMN nexa.shop_page.order_complete_page_layout IS '주문완료 페이지 레이아웃 (DEFAULT, RECEIPT)';
COMMENT ON COLUMN nexa.shop_page.logo_image_path IS '(shop_theme_menu로 이동, 프론트 작업 후 삭제예정)메뉴판 좌측상단 로고 이미지 경로';



-- nexa.shop_setting definition

-- Drop table

-- DROP TABLE nexa.shop_setting;

CREATE TABLE nexa.shop_setting (
	shop_seq int4 NOT NULL, -- 매장 SEQ
	use_theft_prevention bool DEFAULT false NOT NULL, -- 도난방지 알림 사용여부
	service_charge_rate int4 DEFAULT 0 NOT NULL, -- 봉사료율
	currency_setting varchar(10) DEFAULT 'KRW'::character varying NOT NULL, -- 통화설정 (KRW : 원화, USD : 달러,)
	use_pickup_alert bool DEFAULT false NOT NULL, -- 픽업알림 사용여부
	pickup_alert_message varchar(300) NULL, -- 픽업알림 기본메시지
	use_dark_theme bool DEFAULT false NOT NULL, -- (shop_theme_menu로 이동, 프론트 작업 후 삭제예정)다크테마 사용여부
	use_online_pos_mode bool DEFAULT false NOT NULL, -- 온라인 포스모드 사용여부
	use_table_occupancy_time bool DEFAULT false NOT NULL, -- 테이블 점유시간 표기 사용여부
	menuboard_type varchar(50) DEFAULT 'MINUS'::character varying NOT NULL, -- 메뉴판 유형(PLUS / MINUS)
	is_menuboard_orderable bool DEFAULT true NOT NULL, -- 메뉴판 주문가능 여부
	first_order_min_amount float8 DEFAULT 0 NOT NULL, -- 첫주문 최소금액
	use_customer_count bool DEFAULT false NOT NULL, -- 객수 사용여부
	use_kids_customer_count bool DEFAULT false NOT NULL, -- 어린이 객수 사용여부
	is_order_sheet_total_visible bool DEFAULT false NOT NULL, -- 주문서 합계금액 노출 여부
	is_order_complete_total_visible bool DEFAULT false NOT NULL, -- 주문완료페이지총금액노출 여부
	use_single_page_menuboard bool DEFAULT false NOT NULL, -- 단일 페이지 메뉴판 사용여부
	menuboard_admin_password varchar(200) NULL, -- 메뉴판 관리자모드 비밀번호
	is_admin_locked bool DEFAULT false NOT NULL, -- 관리잠금 여부
	use_prepayment bool DEFAULT false NOT NULL, -- 선불 사용여부
	van_code varchar(20) NULL, -- VAN 코드 (EASY : 이지카드)
	is_sales_total_visible bool DEFAULT false NOT NULL, -- 매출 총 금액 노출 여부
	sales_password varchar(200) NULL, -- 매출 비밀번호
	menuboard_template_type varchar(10) DEFAULT 'DEFAULT'::character varying NOT NULL, -- (shop_theme_menu로 이동, 프론트 작업 후 삭제예정)메뉴판 템플릿 유형 (가로형 : "DEFAULT", 세로형 텍스트 : "VERTICAL_TEXT", 세로형 이미지 : "VERTICAL_IMAGE")
	shop_pos_code varchar(20) DEFAULT 'NONE'::character varying NULL, -- 매장 포스코드 (NONE : 연동 포스 없음, OKPOS : 오케이포스)
	shop_card_terminal_code varchar(20) NULL, -- 매장 카드단말기코드 (VIRTUAL : 가상결제, EASY : 이지카드, NO_BUTTON : 결제버튼미사용)
	shop_language varchar(10) DEFAULT 'KO'::character varying NOT NULL, -- 매장 기본 언어( KO : 한국어, EN : 영어, JP : 일본어, CH : 중국어)
	use_locale_before_order bool DEFAULT false NOT NULL, -- 주문 전 다국어 사용여부
	is_menu_three_column_layout bool DEFAULT false NOT NULL, -- (shop_theme_menu로 이동, 프론트 작업 후 삭제예정)3열 배치 여부
	use_prepayment_dutch bool DEFAULT false NOT NULL, -- 선결제 더치페이 사용 여부
	use_prepayment_deferred_payment bool DEFAULT false NOT NULL, -- 선불형 후불결제 사용 여부
	use_prepayment_auto_reset bool DEFAULT false NOT NULL, -- 선불형 자동초기화 사용 여부
	use_prepayment_cash_payment bool DEFAULT false NOT NULL, -- 선불형 현금결제 사용 여부
	use_prepayment_cash_payment_inducement bool DEFAULT false NOT NULL, -- 선불형 현금결제 유도 팝업 사용 여부
	use_table_overlapping bool DEFAULT false NOT NULL,
	use_sold_out_auto_restore bool DEFAULT false NOT NULL,
	van_id varchar(50) NULL, -- VAN ID
	use_locale bool DEFAULT false NOT NULL,
	is_sales_detail_locked bool NULL, -- 매출 세부내역 잠금여부
	CONSTRAINT shop_setting_pkey PRIMARY KEY (shop_seq),
	CONSTRAINT shop_setting_shop_seq_fkey FOREIGN KEY (shop_seq) REFERENCES nexa.shop(shop_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.shop_setting.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop_setting.use_theft_prevention IS '도난방지 알림 사용여부';
COMMENT ON COLUMN nexa.shop_setting.service_charge_rate IS '봉사료율';
COMMENT ON COLUMN nexa.shop_setting.currency_setting IS '통화설정 (KRW : 원화, USD : 달러,)';
COMMENT ON COLUMN nexa.shop_setting.use_pickup_alert IS '픽업알림 사용여부';
COMMENT ON COLUMN nexa.shop_setting.pickup_alert_message IS '픽업알림 기본메시지';
COMMENT ON COLUMN nexa.shop_setting.use_dark_theme IS '(shop_theme_menu로 이동, 프론트 작업 후 삭제예정)다크테마 사용여부';
COMMENT ON COLUMN nexa.shop_setting.use_online_pos_mode IS '온라인 포스모드 사용여부';
COMMENT ON COLUMN nexa.shop_setting.use_table_occupancy_time IS '테이블 점유시간 표기 사용여부';
COMMENT ON COLUMN nexa.shop_setting.menuboard_type IS '메뉴판 유형(PLUS / MINUS)';
COMMENT ON COLUMN nexa.shop_setting.is_menuboard_orderable IS '메뉴판 주문가능 여부';
COMMENT ON COLUMN nexa.shop_setting.first_order_min_amount IS '첫주문 최소금액';
COMMENT ON COLUMN nexa.shop_setting.use_customer_count IS '객수 사용여부';
COMMENT ON COLUMN nexa.shop_setting.use_kids_customer_count IS '어린이 객수 사용여부';
COMMENT ON COLUMN nexa.shop_setting.is_order_sheet_total_visible IS '주문서 합계금액 노출 여부';
COMMENT ON COLUMN nexa.shop_setting.is_order_complete_total_visible IS '주문완료페이지총금액노출 여부';
COMMENT ON COLUMN nexa.shop_setting.use_single_page_menuboard IS '단일 페이지 메뉴판 사용여부';
COMMENT ON COLUMN nexa.shop_setting.menuboard_admin_password IS '메뉴판 관리자모드 비밀번호';
COMMENT ON COLUMN nexa.shop_setting.is_admin_locked IS '관리잠금 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment IS '선불 사용여부';
COMMENT ON COLUMN nexa.shop_setting.van_code IS 'VAN 코드 (EASY : 이지카드)';
COMMENT ON COLUMN nexa.shop_setting.is_sales_total_visible IS '매출 총 금액 노출 여부';
COMMENT ON COLUMN nexa.shop_setting.sales_password IS '매출 비밀번호';
COMMENT ON COLUMN nexa.shop_setting.menuboard_template_type IS '(shop_theme_menu로 이동, 프론트 작업 후 삭제예정)메뉴판 템플릿 유형 (가로형 : "DEFAULT", 세로형 텍스트 : "VERTICAL_TEXT", 세로형 이미지 : "VERTICAL_IMAGE")';
COMMENT ON COLUMN nexa.shop_setting.shop_pos_code IS '매장 포스코드 (NONE : 연동 포스 없음, OKPOS : 오케이포스)';
COMMENT ON COLUMN nexa.shop_setting.shop_card_terminal_code IS '매장 카드단말기코드 (VIRTUAL : 가상결제, EASY : 이지카드, NO_BUTTON : 결제버튼미사용)';
COMMENT ON COLUMN nexa.shop_setting.shop_language IS '매장 기본 언어( KO : 한국어, EN : 영어, JP : 일본어, CH : 중국어)';
COMMENT ON COLUMN nexa.shop_setting.use_locale_before_order IS '주문 전 다국어 사용여부';
COMMENT ON COLUMN nexa.shop_setting.is_menu_three_column_layout IS '(shop_theme_menu로 이동, 프론트 작업 후 삭제예정)3열 배치 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment_dutch IS '선결제 더치페이 사용 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment_deferred_payment IS '선불형 후불결제 사용 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment_auto_reset IS '선불형 자동초기화 사용 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment_cash_payment IS '선불형 현금결제 사용 여부';
COMMENT ON COLUMN nexa.shop_setting.use_prepayment_cash_payment_inducement IS '선불형 현금결제 유도 팝업 사용 여부';
COMMENT ON COLUMN nexa.shop_setting.van_id IS 'VAN ID';
COMMENT ON COLUMN nexa.shop_setting.is_sales_detail_locked IS '매출 세부내역 잠금여부';



-- nexa.shop_time definition

-- Drop table

-- DROP TABLE nexa.shop_time;

CREATE TABLE nexa.shop_time (
	shop_seq int4 NOT NULL, -- 매장 SEQ
	shop_business_start_time varchar(10) NULL, -- 영업시작시간
	shop_business_end_time varchar(10) NULL, -- 영업종료시간
	break_time_message varchar(500) NULL, -- 브레이크타임 메시지
	break_time_last_order_alert_time_before int4 NULL, -- 브레이크타임 라스트오더 알림 시간(분) - 라스트오더 시간 기준 몇 분 전에 알려줄 것인지
	break_time_last_order_message varchar(500) NULL, -- 브레이크타임 라스트오더 메시지
	shop_closure_start_time varchar(10) NULL, -- 폐점시작시간
	shop_closure_end_time varchar(10) NULL, -- 폐점종료시간
	closure_message varchar(500) NULL, -- 폐점 메시지
	closure_last_order_time_before int4 NULL, -- 폐점 라스트오더 시각
	closure_last_order_alert_time_before int4 NULL, -- 폐점 라스트오더 알림 시간
	closure_last_order_message varchar(500) NULL, -- 폐점 라스트오더 메시지
	use_break_time bool DEFAULT false NOT NULL, -- 브레이크타임 기능 사용 여부
	use_closure bool DEFAULT false NOT NULL, -- 영업마감 기능 사용 여부
	break_time_last_order_time_before int4 NULL, -- 브레이크타임 라스트오더 시간(분) - 브레이크타임 시작시간 기준 몇 분 전을 라스트오더로 할 것인지
	CONSTRAINT shop_time_pkey PRIMARY KEY (shop_seq),
	CONSTRAINT shop_time_shop_seq_fkey FOREIGN KEY (shop_seq) REFERENCES nexa.shop(shop_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.shop_time.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.shop_time.shop_business_start_time IS '영업시작시간';
COMMENT ON COLUMN nexa.shop_time.shop_business_end_time IS '영업종료시간';
COMMENT ON COLUMN nexa.shop_time.break_time_message IS '브레이크타임 메시지';
COMMENT ON COLUMN nexa.shop_time.break_time_last_order_alert_time_before IS '브레이크타임 라스트오더 알림 시간(분) - 라스트오더 시간 기준 몇 분 전에 알려줄 것인지';
COMMENT ON COLUMN nexa.shop_time.break_time_last_order_message IS '브레이크타임 라스트오더 메시지';
COMMENT ON COLUMN nexa.shop_time.shop_closure_start_time IS '폐점시작시간';
COMMENT ON COLUMN nexa.shop_time.shop_closure_end_time IS '폐점종료시간';
COMMENT ON COLUMN nexa.shop_time.closure_message IS '폐점 메시지';
COMMENT ON COLUMN nexa.shop_time.closure_last_order_time_before IS '폐점 라스트오더 시각';
COMMENT ON COLUMN nexa.shop_time.closure_last_order_alert_time_before IS '폐점 라스트오더 알림 시간';
COMMENT ON COLUMN nexa.shop_time.closure_last_order_message IS '폐점 라스트오더 메시지';
COMMENT ON COLUMN nexa.shop_time.use_break_time IS '브레이크타임 기능 사용 여부';
COMMENT ON COLUMN nexa.shop_time.use_closure IS '영업마감 기능 사용 여부';
COMMENT ON COLUMN nexa.shop_time.break_time_last_order_time_before IS '브레이크타임 라스트오더 시간(분) - 브레이크타임 시작시간 기준 몇 분 전을 라스트오더로 할 것인지';



-- nexa.table_current_status definition

-- Drop table

-- DROP TABLE nexa.table_current_status;

CREATE TABLE nexa.table_current_status (
	order_group_uuid varchar(50) NOT NULL, -- 주문 그룹 UUID
	order_detail_menu_seq int4 NOT NULL, -- 주문 상세_메뉴 SEQ
	menu_name varchar(50) NOT NULL, -- 메뉴명
	menu_price int8 NOT NULL, -- 메뉴 가격
	menu_quantity int4 NOT NULL, -- 메뉴 수량
	menu_create_date timestamp DEFAULT now() NOT NULL, -- 주문 메뉴 생성 일시
	menu_seq int4 DEFAULT 0 NOT NULL,
	locale_menu_name jsonb NULL,
	CONSTRAINT table_current_status_order_group_uuid_fkey FOREIGN KEY (order_group_uuid) REFERENCES nexa.order_group(order_group_uuid) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.table_current_status.order_group_uuid IS '주문 그룹 UUID';
COMMENT ON COLUMN nexa.table_current_status.order_detail_menu_seq IS '주문 상세_메뉴 SEQ';
COMMENT ON COLUMN nexa.table_current_status.menu_name IS '메뉴명';
COMMENT ON COLUMN nexa.table_current_status.menu_price IS '메뉴 가격';
COMMENT ON COLUMN nexa.table_current_status.menu_quantity IS '메뉴 수량';
COMMENT ON COLUMN nexa.table_current_status.menu_create_date IS '주문 메뉴 생성 일시';



-- nexa.table_info definition

-- Drop table

-- DROP TABLE nexa.table_info;

CREATE TABLE nexa.table_info (
	table_seq bigserial NOT NULL, -- 테이블 SEQ
	shop_seq int4 NOT NULL, -- 매장 SEQ
	table_number varchar(10) NOT NULL, -- 테이블 번호
	mapped_table_id varchar(20) NULL, -- (연동) 테이블 ID
	table_group_seq int4 NOT NULL, -- 테이블 그룹 SEQ
	mapped_group_id varchar(20) NULL, -- (연동) 테이블 그룹 ID
	table_name varchar(20) NULL, -- 테이블 이름
	mapped_upt_dt varchar(50) NULL, -- (연동) 업데이트 일시
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	table_position_x float8 NULL, -- 테이블 위치_X 좌표
	table_position_y float8 NULL, -- 테이블 위치_Y 좌표
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	CONSTRAINT table_info_pkey PRIMARY KEY (table_seq),
	CONSTRAINT table_info_table_group_seq_fkey FOREIGN KEY (table_group_seq) REFERENCES nexa.table_group(table_group_seq) ON DELETE CASCADE,
	CONSTRAINT table_info_table_group_seq_fkey1 FOREIGN KEY (table_group_seq) REFERENCES nexa.table_group(table_group_seq) ON DELETE CASCADE
);

-- Column comments

COMMENT ON COLUMN nexa.table_info.table_seq IS '테이블 SEQ';
COMMENT ON COLUMN nexa.table_info.shop_seq IS '매장 SEQ';
COMMENT ON COLUMN nexa.table_info.table_number IS '테이블 번호';
COMMENT ON COLUMN nexa.table_info.mapped_table_id IS '(연동) 테이블 ID';
COMMENT ON COLUMN nexa.table_info.table_group_seq IS '테이블 그룹 SEQ';
COMMENT ON COLUMN nexa.table_info.mapped_group_id IS '(연동) 테이블 그룹 ID';
COMMENT ON COLUMN nexa.table_info.table_name IS '테이블 이름';
COMMENT ON COLUMN nexa.table_info.mapped_upt_dt IS '(연동) 업데이트 일시';
COMMENT ON COLUMN nexa.table_info.is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa.table_info.table_position_x IS '테이블 위치_X 좌표';
COMMENT ON COLUMN nexa.table_info.table_position_y IS '테이블 위치_Y 좌표';
COMMENT ON COLUMN nexa.table_info.create_date IS '생성일시';
COMMENT ON COLUMN nexa.table_info.create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa.table_info.update_date IS '수정일시';
COMMENT ON COLUMN nexa.table_info.update_member_uuid IS '수정 회원 UUID';
COMMENT ON COLUMN nexa.table_info.is_deleted IS '삭제 여부';



-- nexa."option" definition

-- Drop table

-- DROP TABLE nexa."option";

CREATE TABLE nexa."option" (
	option_seq bigserial NOT NULL, -- 옵션 SEQ
	option_group_seq int4 NULL, -- 옵션그룹 SEQ
	option_name varchar(50) NULL, -- 옵션 이름
	option_price int8 NOT NULL, -- 옵션 가격
	"index" int4 NOT NULL, -- 정렬순번
	is_deleted bool DEFAULT false NOT NULL, -- 삭제 여부
	mapped_option_code varchar(20) NULL, -- (연동) 옵션 코드
	mapped_option_name varchar(200) NULL, -- (연동) 옵션 이름
	mapped_option_group_code varchar(20) NULL, -- (연동) 옵션그룹 코드
	mapped_menu_code varchar(20) NULL, -- (연동) 메뉴 코드
	mapped_upt_dt varchar(50) NULL, -- (연동) 업데이트 일시
	is_mapped bool DEFAULT false NOT NULL, -- 매핑 여부
	is_out_of_stock bool DEFAULT false NOT NULL, -- 품절 여부
	locale_option_name jsonb NULL, -- 다국어 옵션 이름
	locale_option_description jsonb NULL, -- 다국어 옵션 설명
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	create_member_uuid varchar(50) NULL, -- 생성 회원 UUID
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	update_member_uuid varchar(50) NULL, -- 수정 회원 UUID
	is_tax_free bool DEFAULT false NULL,
	CONSTRAINT option_pkey PRIMARY KEY (option_seq),
	CONSTRAINT option_option_group_seq_fkey FOREIGN KEY (option_group_seq) REFERENCES nexa.option_group(option_group_seq) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_option_mapped_option_code_notnull ON nexa.option USING btree (mapped_option_code, option_group_seq) WHERE (mapped_option_code IS NOT NULL);

-- Column comments

COMMENT ON COLUMN nexa."option".option_seq IS '옵션 SEQ';
COMMENT ON COLUMN nexa."option".option_group_seq IS '옵션그룹 SEQ';
COMMENT ON COLUMN nexa."option".option_name IS '옵션 이름';
COMMENT ON COLUMN nexa."option".option_price IS '옵션 가격';
COMMENT ON COLUMN nexa."option"."index" IS '정렬순번';
COMMENT ON COLUMN nexa."option".is_deleted IS '삭제 여부';
COMMENT ON COLUMN nexa."option".mapped_option_code IS '(연동) 옵션 코드';
COMMENT ON COLUMN nexa."option".mapped_option_name IS '(연동) 옵션 이름';
COMMENT ON COLUMN nexa."option".mapped_option_group_code IS '(연동) 옵션그룹 코드';
COMMENT ON COLUMN nexa."option".mapped_menu_code IS '(연동) 메뉴 코드';
COMMENT ON COLUMN nexa."option".mapped_upt_dt IS '(연동) 업데이트 일시';
COMMENT ON COLUMN nexa."option".is_mapped IS '매핑 여부';
COMMENT ON COLUMN nexa."option".is_out_of_stock IS '품절 여부';
COMMENT ON COLUMN nexa."option".locale_option_name IS '다국어 옵션 이름';
COMMENT ON COLUMN nexa."option".locale_option_description IS '다국어 옵션 설명';
COMMENT ON COLUMN nexa."option".create_date IS '생성일시';
COMMENT ON COLUMN nexa."option".create_member_uuid IS '생성 회원 UUID';
COMMENT ON COLUMN nexa."option".update_date IS '수정일시';
COMMENT ON COLUMN nexa."option".update_member_uuid IS '수정 회원 UUID';



-- nexa.order_detail_menu definition

-- Drop table

-- DROP TABLE nexa.order_detail_menu;

CREATE TABLE nexa.order_detail_menu (
	order_detail_menu_seq bigserial NOT NULL, -- 주문 상세_메뉴 SEQ
	order_uuid varchar(50) NOT NULL, -- 주문 UUID
	menu_seq int4 NULL, -- 메뉴 SEQ
	menu_name varchar(50) NULL, -- 메뉴 이름
	menu_price int8 NULL, -- 메뉴 가격
	menu_quantity int4 NULL, -- 메뉴 수량
	final_price int8 NULL, -- 가격
	canceled_quantity int4 DEFAULT 0 NOT NULL, -- 취소 메뉴 수량
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	update_date timestamp DEFAULT now() NOT NULL, -- 수정일시
	locale_menu_name jsonb NULL,
	sds_org_dtl_no varchar(20) NULL,
	CONSTRAINT order_detail_menu_pkey PRIMARY KEY (order_detail_menu_seq),
	CONSTRAINT order_detail_menu_order_uuid_fkey FOREIGN KEY (order_uuid) REFERENCES nexa.order_info(order_uuid) ON DELETE CASCADE
);
CREATE INDEX idx_odm_order_uuid ON nexa.order_detail_menu USING btree (order_uuid);

-- Column comments

COMMENT ON COLUMN nexa.order_detail_menu.order_detail_menu_seq IS '주문 상세_메뉴 SEQ';
COMMENT ON COLUMN nexa.order_detail_menu.order_uuid IS '주문 UUID';
COMMENT ON COLUMN nexa.order_detail_menu.menu_seq IS '메뉴 SEQ';
COMMENT ON COLUMN nexa.order_detail_menu.menu_name IS '메뉴 이름';
COMMENT ON COLUMN nexa.order_detail_menu.menu_price IS '메뉴 가격';
COMMENT ON COLUMN nexa.order_detail_menu.menu_quantity IS '메뉴 수량';
COMMENT ON COLUMN nexa.order_detail_menu.final_price IS '가격';
COMMENT ON COLUMN nexa.order_detail_menu.canceled_quantity IS '취소 메뉴 수량';
COMMENT ON COLUMN nexa.order_detail_menu.create_date IS '생성일시';
COMMENT ON COLUMN nexa.order_detail_menu.update_date IS '수정일시';



-- nexa.order_detail_option definition

-- Drop table

-- DROP TABLE nexa.order_detail_option;

CREATE TABLE nexa.order_detail_option (
	order_detail_option_seq bigserial NOT NULL, -- 주문 상세_옵션 SEQ
	order_detail_menu_seq int4 NOT NULL, -- 주문 상세_메뉴 SEQ
	option_seq int4 NULL, -- 옵션 SEQ
	option_name varchar(50) NULL, -- 옵션 이름
	option_price int8 NULL, -- 옵션 가격
	option_group_name varchar(50) NULL, -- 옵션그룹 이름
	option_quantity int4 NULL, -- 옵션 수량
	create_date timestamp DEFAULT now() NOT NULL, -- 생성일시
	is_menu_quantity_independent bool DEFAULT false NOT NULL, -- 메뉴 수량 종속 여부
	locale_option_name jsonb NULL,
	mapped_dc_amt int8 DEFAULT 0 NULL, -- (연동) 할인금액
	canceled_option_quantity int4 DEFAULT 0 NOT NULL,
	CONSTRAINT order_detail_option_pkey PRIMARY KEY (order_detail_option_seq),
	CONSTRAINT order_detail_option_order_detail_menu_seq_fkey FOREIGN KEY (order_detail_menu_seq) REFERENCES nexa.order_detail_menu(order_detail_menu_seq) ON DELETE CASCADE
);
CREATE INDEX idx_odo_menu_seq ON nexa.order_detail_option USING btree (order_detail_menu_seq);

-- Column comments

COMMENT ON COLUMN nexa.order_detail_option.order_detail_option_seq IS '주문 상세_옵션 SEQ';
COMMENT ON COLUMN nexa.order_detail_option.order_detail_menu_seq IS '주문 상세_메뉴 SEQ';
COMMENT ON COLUMN nexa.order_detail_option.option_seq IS '옵션 SEQ';
COMMENT ON COLUMN nexa.order_detail_option.option_name IS '옵션 이름';
COMMENT ON COLUMN nexa.order_detail_option.option_price IS '옵션 가격';
COMMENT ON COLUMN nexa.order_detail_option.option_group_name IS '옵션그룹 이름';
COMMENT ON COLUMN nexa.order_detail_option.option_quantity IS '옵션 수량';
COMMENT ON COLUMN nexa.order_detail_option.create_date IS '생성일시';
COMMENT ON COLUMN nexa.order_detail_option.is_menu_quantity_independent IS '메뉴 수량 종속 여부';
COMMENT ON COLUMN nexa.order_detail_option.mapped_dc_amt IS '(연동) 할인금액';










